using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Shared;
using Microsoft.Extensions.Logging;

namespace Andromeda.Services
{
    public class DepartmentService
    {
        private readonly IDepartmentDao _dao;
        private readonly RoleInDepartmentService _roleInDepartmentService;
        private readonly UserRoleInDepartmentService _userRoleInDepartmentService;
        private readonly DisciplineTitleService _discplineTitleService;
        private readonly StudyDirectionService _studyDirectionService;
        private readonly StudentGroupService _studentGroupService;
        private readonly ILogger _logger;

        public DepartmentService(
            IDepartmentDao dao,
            RoleInDepartmentService roleInDepartmentService,
            UserRoleInDepartmentService userRoleInDepartmentService,
            DisciplineTitleService disciplineTitleService,
            StudyDirectionService studyDirectionService,
            StudentGroupService studentGroupService,
            ILogger logger)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _roleInDepartmentService = roleInDepartmentService ?? throw new ArgumentException(nameof(roleInDepartmentService));
            _userRoleInDepartmentService = userRoleInDepartmentService ?? throw new ArgumentException(nameof(userRoleInDepartmentService));
            _discplineTitleService = disciplineTitleService ?? throw new ArgumentException(nameof(disciplineTitleService));
            _studyDirectionService = studyDirectionService ?? throw new ArgumentException(nameof(studyDirectionService));
            _studentGroupService = studentGroupService ?? throw new ArgumentException(nameof(studentGroupService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<Department>> Get(DepartmentGetOptions options)
        {
            var departments = await _dao.Get(options);
            var departmentsIds = departments.Select(o => o.Id).ToList();
            var departmentDisciplinesTitles = await _discplineTitleService.Get(new DisciplineTitleGetOptions { DepartmentIds = departmentsIds });
            var departmentsUsers = await _userRoleInDepartmentService.Get(new UserRoleInDepartmentGetOptions { DepartmentIds = departmentsIds });
            var departmentsRoles = await _roleInDepartmentService.Get(new RoleInDepartmentGetOptions { DepartmentIds = departmentsIds });
            var departmentsStudyDirections = await _studyDirectionService.Get(new StudyDirectionGetOptions { DepartmentIds = departmentsIds });
            var departmentsGroups = await _studentGroupService.Get(new StudentGroupGetOptions { DepartmentIds = departmentsIds });

            foreach (var group in departmentsGroups)
            {
                group.StudyDirection = departmentsStudyDirections.FirstOrDefault(o => o.Id == group.StudyDirectionId);
            }

            foreach (var department in departments)
            {
                department.Titles = departmentDisciplinesTitles.Where(o => o.DepartmentId == department.Id).ToList();
                department.Users = departmentsUsers.Where(o => o.DepartmentId == department.Id).ToList();
                department.Roles = departmentsRoles.Where(o => o.DepartmentId == department.Id).ToList();
                department.StudyDirections = departmentsStudyDirections.Where(o => o.DepartmentId == department.Id).ToList();
                department.Groups = departmentsGroups.Where(o => o.DepartmentId == department.Id).ToList();
            }

            return departments;
        }

        public async Task<Department> Create(Department model)
        {
            await _dao.Create(model);
            if (model.Users != null)
            {
                model.Users.ForEach(o => o.DepartmentId = model.Id);
                await _userRoleInDepartmentService.Create(model.Users);
            }

            if (model.Groups != null)
            {
                model.Groups.ForEach(o => o.DepartmentId = model.Id);
                await _studentGroupService.Create(model.Groups);
            }

            if (model.StudyDirections != null)
            {
                model.StudyDirections.ForEach(o => o.DepartmentId = model.Id);
                await _studyDirectionService.Create(model.StudyDirections);
            }

            if (model.Titles != null)
            {
                model.Titles.ForEach(o => o.DepartmentId = model.Id);
                await _discplineTitleService.Create(model.Titles);
            }

            if(model.ChildDepartments != null)
            {
                foreach(var department in model.ChildDepartments)
                {
                    department.ParentId = model.Id;
                    await Create(department);
                }
            }

            return model;
        }

        public async Task<Department> Update(Department model)
        {
            await _dao.Update(model);

            if (model.Titles != null)
                await UpdateDepartmentDisciplinesTitles(model.Id, model.Titles);

            if (model.Users != null)
                await UpdateDepartmentUsersRoles(model.Id, model.Users);

            if (model.StudyDirections != null)
                await UpdateDepartmentStudyDirections(model.Id, model.StudyDirections);

            if (model.Groups != null)
                await UpdateDepartmentStudentsGroups(model.Id, model.Groups);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }

        public async Task<string> Validate(DepartmentGetOptions options)
        {
            try
            {
                _logger.LogInformation("Start department validating.");

                string result = ValidationUtilities.ValidateDepartmentFullName(options.FullName);
                if (!string.IsNullOrEmpty(result))
                    return result;

                var models = await _dao.Get(options);
                if (models.Count() > 0)
                {
                    string message = "Department with same name have been already created. Please try another.";
                    _logger.LogInformation(message);
                    return message;
                }

                _logger.LogInformation("Department successfuly validated.");
                return null;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task UpdateDepartmentDisciplinesTitles(int departmentId, List<DisciplineTitle> models)
        {
            var old = await _discplineTitleService.Get(new DisciplineTitleGetOptions { DepartmentId = departmentId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.DepartmentId = departmentId);

            await _discplineTitleService.Delete(toDelete);
            await _discplineTitleService.Update(toUpdate);
            await _discplineTitleService.Create(toCreate);
        }

        public async Task UpdateDepartmentUsersRoles(int departmentId, List<UserRoleInDepartment> models)
        {
            var old = await _userRoleInDepartmentService.Get(new UserRoleInDepartmentGetOptions
            {
                DepartmentId = departmentId
            });
            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.DepartmentId = departmentId);

            await _userRoleInDepartmentService.Delete(toDelete);
            await _userRoleInDepartmentService.Update(toUpdate);
            await _userRoleInDepartmentService.Create(toCreate);
        }

        public async Task UpdateDepartmentStudyDirections(int departmentId, List<StudyDirection> models)
        {
            var old = await _studyDirectionService.Get(new StudyDirectionGetOptions
            {
                DepartmentId = departmentId
            });
            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.DepartmentId = departmentId);

            await _studyDirectionService.Delete(toDelete);
            await _studyDirectionService.Update(toUpdate);
            await _studyDirectionService.Create(toCreate);
        }

        public async Task UpdateDepartmentStudentsGroups(int departmentId, List<StudentGroup> models)
        {
            var studyDirections = await _studyDirectionService.Get(new StudyDirectionGetOptions { DepartmentId = departmentId });
            var old = await _studentGroupService.Get(new StudentGroupGetOptions { DepartmentId = departmentId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o =>
            {
                var direction = studyDirections.FirstOrDefault(sd => sd.Code == o.StudyDirection.Code);

                o.DepartmentId = departmentId;
                o.StudyDirectionId = direction.Id;
            });

            await _studentGroupService.Delete(toDelete);
            await _studentGroupService.Update(toUpdate);
            await _studentGroupService.Create(toCreate);
        }
    }
}