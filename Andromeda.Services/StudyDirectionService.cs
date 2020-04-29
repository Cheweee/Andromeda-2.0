using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class StudyDirectionService
    {
        private readonly IStudyDirectionDao _dao;

        public StudyDirectionService(IStudyDirectionDao dao)
        {
            _dao = dao;
        }

        public async Task<IEnumerable<StudyDirection>> Get(StudyDirectionGetOptions options)
        {
            return await _dao.Get(options);
        }

        public async Task<List<StudyDirection>> Create(List<StudyDirection> models)
        {
            await _dao.Create(models);

            return models;
        }

        public async Task<List<StudyDirection>> Update(List<StudyDirection> models)
        {
            await _dao.Update(models);

            return models;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }
    }
}