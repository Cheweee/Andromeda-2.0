using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class GroupDisciplineLoadService
    {
        private readonly IGroupDisciplineLoadDao _groupDisciplineLoadDao;

        private readonly StudyLoadService _studyLoadService;
        private readonly DisciplineTitleService _disciplineTitleService;
        private readonly StudentGroupService _studentGroupService;

        public GroupDisciplineLoadService(
                IGroupDisciplineLoadDao groupDisciplineLoadDao,
                StudyLoadService studyLoadService,
                DisciplineTitleService disciplineTitleService,
                StudentGroupService studentGroupService
            )
        {
            _groupDisciplineLoadDao = groupDisciplineLoadDao ?? throw new ArgumentException(nameof(groupDisciplineLoadDao));

            _studyLoadService = studyLoadService ?? throw new ArgumentException(nameof(studyLoadService));
            _disciplineTitleService = disciplineTitleService ?? throw new ArgumentException(nameof(disciplineTitleService));
            _studentGroupService = studentGroupService ?? throw new ArgumentException(nameof(studentGroupService));
        }

        public async Task<IEnumerable<GroupDisciplineLoad>> Get(GroupDisciplineLoadGetOptions options)
        {
            var groupDisciplineLoad = await _groupDisciplineLoadDao.Get(options);

            var studyLoad = await _studyLoadService.Get(new StudyLoadGetOptions
            {
                GroupDisciplineLoadsIds = groupDisciplineLoad.Select(o => o.Id).ToList()
            });

            var disciplineTitles = await _disciplineTitleService.Get(new DisciplineTitleGetOptions
            {
                DepartmentLoadsIds = options.DepartmentLoadsIds
            });

            var studentGroups = await _studentGroupService.Get(new StudentGroupGetOptions
            {
                DepartmentLoadsIds = options.DepartmentLoadsIds
            });

            foreach (var load in groupDisciplineLoad)
            {
                load.DisciplineTitle = disciplineTitles.FirstOrDefault(o => o.Id == load.DisciplineTitleId);
                load.StudentGroup = studentGroups.FirstOrDefault(o => o.Id == load.StudentGroupId);
                load.StudyLoad = studyLoad.Where(o => o.GroupDisciplineLoadId == load.Id).ToList();
            }

            return groupDisciplineLoad;
        }

        public async Task<GroupDisciplineLoad> Create(GroupDisciplineLoad model)
        {
            await _groupDisciplineLoadDao.Create(model);

            await UpdateStudyLoad(model.Id, model.StudyLoad);

            return model;
        }

        public async Task<GroupDisciplineLoad> Update(GroupDisciplineLoad model)
        {
            await _groupDisciplineLoadDao.Update(model);

            await UpdateStudyLoad(model.Id, model.StudyLoad);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _groupDisciplineLoadDao.Delete(ids);
        }

        public async Task UpdateStudyLoad(int groupDisciplineId, List<StudyLoad> models)
        {
            var old = await _studyLoadService.Get(new StudyLoadGetOptions { GroupDisciplineLoadId = groupDisciplineId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.GroupDisciplineLoadId = groupDisciplineId);

            await _studyLoadService.Delete(toDelete);
            await _studyLoadService.Update(toUpdate);
            await _studyLoadService.Create(toCreate);
        }
    }
}