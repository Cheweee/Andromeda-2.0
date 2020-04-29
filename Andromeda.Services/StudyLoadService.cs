using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class StudyLoadService
    {
        private readonly IStudyLoadDao _studyLoadDao;

        public StudyLoadService(IStudyLoadDao studyLoadDao)
        {
            _studyLoadDao = studyLoadDao ?? throw new ArgumentNullException(nameof(studyLoadDao));
        }

        public async Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options) => await _studyLoadDao.Get(options);

        public async Task<List<StudyLoad>> Create(List<StudyLoad> model) 
        {
            await _studyLoadDao.Create(model);
            return model;
        }

        public async Task<List<StudyLoad>> Update(List<StudyLoad> model)
        {
            await _studyLoadDao.Update(model);
            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _studyLoadDao.Delete(ids);
        }
    }
}