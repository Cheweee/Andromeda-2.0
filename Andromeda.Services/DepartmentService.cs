using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Utilities;
using Microsoft.Extensions.Logging;

namespace Andromeda.Services
{
    public class DepartmentService
    {
        private readonly IDepartmentDao _dao;
        private readonly RoleInDepartmentService _roleInDepartmentService;
        private readonly UserRoleInDepartmentService _userRoleInDepartmentService;
        private readonly ILogger _logger;

        public DepartmentService(IDepartmentDao dao, RoleInDepartmentService roleInDepartmentService, UserRoleInDepartmentService userRoleInDepartmentService, ILogger logger)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _roleInDepartmentService = roleInDepartmentService ?? throw new ArgumentException(nameof(roleInDepartmentService));
            _userRoleInDepartmentService = userRoleInDepartmentService ?? throw new ArgumentException(nameof(userRoleInDepartmentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<Department>> Get(DepartmentGetOptions options)
        {
            var departments = await _dao.Get(options);
            var departmentsUsers = await _userRoleInDepartmentService.Get(new UserRoleInDepartmentGetOptions
            {
                DepartmentIds = departments.Select(o => o.Id).ToList()
            });
            var departmentsRoles = await _roleInDepartmentService.Get(new RoleInDepartmentGetOptions
            {
                DepartmentIds = departments.Select(o => o.Id).ToList()
            });

            foreach (var department in departments)
            {
                department.DepartmentUsers = departmentsUsers.Where(o => o.DepartmentId == department.Id).ToList();
                department.DepartmentRoles = departmentsRoles.Where(o => o.DepartmentId == department.Id).ToList();
            }

            return departments;
        }

        public async Task<Department> Create(Department model)
        {
            await _dao.Create(model);
            if (model.DepartmentUsers != null)
            {
                model.DepartmentUsers.ForEach(o => o.DepartmentId = model.Id);
                await _userRoleInDepartmentService.Create(model.DepartmentUsers);
            }

            return model;
        }

        public async Task<Department> Update(Department model)
        {
            await _dao.Update(model);
            var oldRoleDepartments = await _userRoleInDepartmentService.Get(new UserRoleInDepartmentGetOptions
            {
                DepartmentId = model.Id
            });
            var DepartmentUsersToDelete = oldRoleDepartments.Select(o => o.Id).Where(o => !model.DepartmentUsers.Select(du => du.Id).Contains(o)).ToList();
            var DepartmentUsersToUpdate = oldRoleDepartments.Where(o => model.DepartmentUsers.Select(du => du.Id).Contains(o.Id)).ToList();
            var DepartmentUsersToCreate = model.DepartmentUsers.Where(o => !oldRoleDepartments.Select(du => du.Id).Contains(o.Id)).ToList();

            DepartmentUsersToCreate.ForEach(o => o.DepartmentId = model.Id);

            await _userRoleInDepartmentService.Delete(DepartmentUsersToDelete);
            await _userRoleInDepartmentService.Update(DepartmentUsersToUpdate);
            await _userRoleInDepartmentService.Create(DepartmentUsersToCreate);

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
    }
}