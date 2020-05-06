using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public class CalculateRatiosStrategy : IGenerateStrategy
    {
        private readonly RoleService _roleService;

        private readonly UserRoleInDepartmentService _userRoleInDepartmentService;

        public CalculateRatiosStrategy(
            RoleService roleService,
            UserRoleInDepartmentService userRoleInDepartmentService
        )
        {
            _roleService = roleService ?? throw new ArgumentNullException(nameof(roleService));
            _userRoleInDepartmentService = userRoleInDepartmentService ?? throw new ArgumentNullException(nameof(userRoleInDepartmentService));
        }

        public async Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model, List<GenerateRatio> generateRatios)
        {
            await CalculateRatios(model, generateRatios);

            return model;
        }

        private async Task<DepartmentLoad> CalculateRatios(DepartmentLoad model, List<GenerateRatio> generateRatios)
        {
            try
            {
                var groupDisciplineLoads = model.GroupDisciplineLoad
                    .Where(o => o.StudyLoad.Any(sl => generateRatios.Any(gr => gr.StudyLoadId == sl.Id)))
                    .ToList();

                IEnumerable<int> usersIds = generateRatios.SelectMany(o => o.Ratios.Select(r => r.Key.Id)).Distinct();

                var usersRolesInDepartment = await _userRoleInDepartmentService.Get(new UserRoleInDepartmentGetOptions
                {
                    DepartmentId = model.DepartmentId,
                    UserIds = usersIds.ToList()
                });

                var roles = await _roleService.Get(new RoleGetOptions
                {
                    Ids = usersRolesInDepartment.Select(o => o.RoleId).ToList()
                });

                foreach (var groupDisciplineLoad in groupDisciplineLoads)
                {
                    var studyLoads = groupDisciplineLoad.StudyLoad
                        .Where(o => generateRatios.Any(gr => gr.StudyLoadId == o.Id))
                        .ToList();

                    foreach (var studyLoad in groupDisciplineLoad.StudyLoad)
                    {
                        var studyLoadRatio = generateRatios.Find(o => o.StudyLoadId == studyLoad.Id);
                        if (studyLoadRatio == null || studyLoadRatio.Ratios.Count == 0)
                            continue;

                        User user = null;
                        var orderedRatios = studyLoadRatio.Ratios.OrderBy(o => o.Value).ToList();
                        for(int i = 0; i < orderedRatios.Count; i++)
                        {
                            var supposedUser = orderedRatios[i].Key;
                            var userRolesInDepartment = usersRolesInDepartment.Where(o => o.UserId == supposedUser.Id).ToList();
                            var role = roles.FirstOrDefault(o => userRolesInDepartment.Any(urd => urd.RoleId == o.Id) && o.CanTeach);
                            double userLoadSum = groupDisciplineLoads
                                .Where(o => o.StudyLoad.Any(sl => sl.UsersLoad.Any(ul => ul.UserId == supposedUser.Id)))
                                .SelectMany(o => o.StudyLoad)
                                .Sum(o => o.Value);

                            double supposedUserLoadSum = userLoadSum + studyLoad.Value;

                            if (role != null && role.MaxLoad > supposedUserLoadSum) {
                                user = supposedUser;
                                break;
                            }
                        }

                        if (user != null)
                        {
                            studyLoad.UsersLoad.Add(new UserLoad
                            {
                                StudentsCount = groupDisciplineLoad.StudentGroup.StudentsCount,
                                StudyLoadId = studyLoad.Id,
                                UserId = user.Id,
                                User = user
                            });
                        }
                    }
                }

                return model;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }
    }
}