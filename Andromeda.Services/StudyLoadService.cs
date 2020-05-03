using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class StudyLoadService
    {
        private readonly IStudyLoadDao _studyLoadDao;

        private readonly UserLoadService _userLoadService;

        public StudyLoadService(IStudyLoadDao studyLoadDao, UserLoadService userLoadService)
        {
            _studyLoadDao = studyLoadDao ?? throw new ArgumentNullException(nameof(studyLoadDao));
            _userLoadService = userLoadService ?? throw new ArgumentNullException(nameof(userLoadService));
        }

        public async Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options)
        {
            var studyLoad = await _studyLoadDao.Get(options);

            var usersLoad = await _userLoadService.Get(new UserLoadGetOptions
            {
                StudyLoadsIds = studyLoad.Select(o => o.Id).ToList()
            });

            foreach (var load in studyLoad)
            {
                load.UsersLoad = usersLoad.Where(o => o.StudyLoadId == load.Id).ToList();
            }

            return studyLoad;
        }

        public async Task<StudyLoad> Create(StudyLoad model)
        {
            await _studyLoadDao.Create(model);

            await UpdateUserLoad(model.Id, model.UsersLoad);

            return model;
        }

        public async Task<StudyLoad> Update(StudyLoad model)
        {
            await _studyLoadDao.Update(model);

            await UpdateUserLoad(model.Id, model.UsersLoad);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _studyLoadDao.Delete(ids);
        }

        public async Task UpdateUserLoad(int studyLoadId, List<UserLoad> models)
        {
            var old = await _userLoadService.Get(new UserLoadGetOptions { StudyLoadId = studyLoadId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = models.Where(o => old.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.StudyLoadId = studyLoadId);

            await _userLoadService.Delete(toDelete);
            await _userLoadService.Update(toUpdate);
            await _userLoadService.Create(toCreate);
        }
    }
}