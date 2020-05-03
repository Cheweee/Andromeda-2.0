using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class UserGraduateDegreeService
    {
        private readonly IUserGraduateDegreeDao _dao;

        public UserGraduateDegreeService(IUserGraduateDegreeDao dao)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
        }

        public async Task<IEnumerable<UserGraduateDegree>> Get(UserGraduateDegreeGetOptions options)
        {
            var userGraduateDegree = await _dao.Get(options);

            return userGraduateDegree;
        }

        public async Task<List<UserGraduateDegree>> Create(List<UserGraduateDegree> models)
        {
            await _dao.Create(models);
            return models;
        }

        public async Task<List<UserGraduateDegree>> Update(List<UserGraduateDegree> models)
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