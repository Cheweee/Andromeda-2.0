using System;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Services.GenerateLoadStrategies
{
    public class ByPinnedDisciplinesStrategy : IGenerateStrategy
    {
        private readonly UserService _userService;
        private readonly PinnedDisciplineService _pinnedDisciplineService;

        public ByPinnedDisciplinesStrategy(UserService userService, PinnedDisciplineService pinnedDisciplineService)
        {            
            _userService = userService ?? throw new ArgumentException(nameof(userService));
            _pinnedDisciplineService = pinnedDisciplineService ?? throw new ArgumentException(nameof(pinnedDisciplineService));
        }

        public async Task<DepartmentLoad> Generate(DepartmentLoad model)
        {
            // int departmentId = model.DepartmentId;
            // var studyLoad = model.StudyLoad;
            // var disciplinesTitlesIds = model.StudyLoad.Select(o => o.DisciplineTitleId);
            // var pinnedDisciplines = await _pinnedDisciplineService.Get(new PinnedDisciplineGetOptions { DisciplineTitlesIds = disciplinesTitlesIds.ToList() });
            // var users = await _userService.Get(new UserGetOptions{ Ids = pinnedDisciplines.Select(o => o.UserId).ToList() });
            // foreach (var pd in pinnedDisciplines)
            // {
            //     var load = studyLoad.FirstOrDefault(o => o.ProjectType == pd.ProjectType && o.DisciplineTitleId == pd.DisciplineTitleId);
            //     load.UserId = pd.UserId;
            //     load.User = users.FirstOrDefault(o => o.Id == pd.UserId);
            // }

            return model;
        }
    }
}