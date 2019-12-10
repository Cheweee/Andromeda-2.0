using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Enumerations;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;

namespace Andromeda.Services
{
    public class DisciplineTitleService
    {
        private readonly IDisciplineTitleDao _dao;

        public DisciplineTitleService(IDisciplineTitleDao dao)
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
        }

        public async Task<IEnumerable<DisciplineTitle>> Get(DisciplineTitleGetOptions options)
        {
            return await _dao.Get(options);
        }

        public async Task<IEnumerable<DisciplineTitle>> GetNotPinnedDisciplines(DisciplineTitleGetOptions options)
        {
            var models = await _dao.Get(options);
            var resultModels = models.GroupBy(o => o.Id).Select(o => o.First()).ToList();
            var allTypes = Enum.GetValues(typeof(ProjectType)).Cast<ProjectType>().ToList();

            foreach (var model in resultModels)
            {
                var pinnedProjectTypes = models.Where(o => o.Id == model.Id).Select(o => o.PinnedProjectType);
                model.NotPinnedProjectTypes = allTypes.Where(o => !pinnedProjectTypes.Contains(o)).ToList();
            }

            return resultModels;
        }

        public async Task<List<DisciplineTitle>> Create(List<DisciplineTitle> models)
        {
            await _dao.Create(models);

            return models;
        }

        public async Task<List<DisciplineTitle>> Update(List<DisciplineTitle> models)
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