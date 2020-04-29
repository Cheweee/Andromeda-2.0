using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class PinnedDisciplineService
    {
        private readonly IPinnedDisciplineDao _dao;

        public PinnedDisciplineService(IPinnedDisciplineDao dao)
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
        }

        public async Task<IEnumerable<PinnedDiscipline>> Get(PinnedDisciplineGetOptions options)
        {
            return await _dao.Get(options);
        }

        public async Task<List<PinnedDiscipline>> Create(List<PinnedDiscipline> models)
        {
            await _dao.Create(models);

            return models;
        }

        public async Task<List<PinnedDiscipline>> Update(List<PinnedDiscipline> models)
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