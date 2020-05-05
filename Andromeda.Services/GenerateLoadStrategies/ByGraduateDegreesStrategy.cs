using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Models.Entities;
using Andromeda.Models.Enumerations;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public class ByGraduateDegreesStrategy : IGenerateStrategy
    {
        const double candidatOfSciencesRatioValue = 2;
        const double doctorOfSciencesRatioValue = 3;

        private readonly UserService _userService;

        public ByGraduateDegreesStrategy(UserService userService)
        {
            _userService = userService ?? throw new ArgumentException(nameof(userService));
        }

        ///<summary> Распределение коэффициентов по ученым степеням для распределения нагрузки </summary>
        public async Task<DepartmentLoad> Generate(DepartmentLoadGenerateOptions options, DepartmentLoad model, List<GenerateRatio> generateRatios)
        {
            // Если не указан флаг использовать закрепленные дисциплины при распределении нагрузки
            if (!options.UseGraduateDegrees.HasValue || !options.UseGraduateDegrees.Value) return model;

            var users = await _userService.Get(new UserGetOptions { DepartmentId = model.DepartmentId });

            var loads = model.GroupDisciplineLoad;

            foreach (var load in loads)
            {
                foreach (var studyLoad in load.StudyLoad)
                {
                    var generateRatio = generateRatios.FirstOrDefault(o => o.StudyLoadId == studyLoad.Id);
                    var ratios = users
                        .ToDictionary(o => o,
                            o => o.GraduateDegrees.Any(gd => gd.GraduateDegree == GraduateDegree.DoctorOfSciences)
                                ? doctorOfSciencesRatioValue
                                : candidatOfSciencesRatioValue
                        );

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
                                double newRatioValue = existedUserRatio.Value
                                    + (existedUserRatio.Key.GraduateDegrees
                                        .Any(gd => gd.GraduateDegree == GraduateDegree.DoctorOfSciences)
                                            ? doctorOfSciencesRatioValue
                                            : candidatOfSciencesRatioValue
                                    );
                                existedUserRatio = new KeyValuePair<User, double>(existedUserRatio.Key, newRatioValue);
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