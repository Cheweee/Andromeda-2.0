using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public class ByPinnedDisciplinesStrategy : IGenerateStrategy
    {
        const double ratioValue = 0.4;
        private readonly UserService _userService;

        public ByPinnedDisciplinesStrategy(UserService userService)
        {
            _userService = userService ?? throw new ArgumentException(nameof(userService));
        }

        ///<summary> Распределение коэффициентов по закрепленным дисициплинам для распределения нагрузки </summary>
        public async Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model, List<GenerateRatio> generateRatios)
        {
            // Если не указан флаг использовать закрепленные дисциплины при распределении нагрузки
            if (!options.UsePinnedDisciplines.HasValue || !options.UsePinnedDisciplines.Value) return model;

            var users = await _userService.Get(new UserGetOptions { DepartmentId = model.DepartmentId, OnlyWithPinnedDisciplines = true });
            var allPinnedDisciplines = users.SelectMany(u => u.PinnedDisciplines).ToList();

            var loads = model.GroupDisciplineLoad
                .Where(o => allPinnedDisciplines.Any(pd => pd.DisciplineTitleId == o.DisciplineTitleId))
                .Select(o => new KeyValuePair<int, List<StudyLoad>>(
                        o.DisciplineTitleId,
                        o.StudyLoad.Where(sl => allPinnedDisciplines.Any(pd => pd.ProjectType == sl.ProjectType)).ToList()
                    )
                )
                .ToList();

            foreach (var load in loads)
            {
                var userPinnedDiscipline = users.Where(o => o.PinnedDisciplines.Any(o => o.DisciplineTitleId == load.Key));
                foreach (var studyLoad in load.Value)
                {
                    var generateRatio = generateRatios.FirstOrDefault(o => o.StudyLoadId == studyLoad.Id);
                    var ratios = userPinnedDiscipline
                        .Where(o => o.PinnedDisciplines.Any(pd => pd.ProjectType == studyLoad.ProjectType))
                        .ToDictionary(o => o, o => ratioValue);

                    if (generateRatio == null)
                    {
                        generateRatios.Add(new GenerateRatio
                        {
                            StudyLoadId = studyLoad.Id,
                            Ratios = ratios
                        });
                    }
                    else
                    {
                        foreach (var userRatio in ratios)
                        {
                            var existedUserRatio = generateRatio.Ratios.FirstOrDefault(o => o.Key.Id == userRatio.Key.Id);
                            if (existedUserRatio.Key != null)
                            {
                                existedUserRatio = new KeyValuePair<User, double>(existedUserRatio.Key, existedUserRatio.Value + ratioValue);
                            }
                            generateRatio.Ratios.Add(userRatio.Key, userRatio.Value);
                        }
                    }
                }
            }

            return model;
        }
    }
}