using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class RoleInDepartmentService
    {
        private readonly IRoleInDepartmentDao _dao;
        public RoleInDepartmentService(IRoleInDepartmentDao dao)
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
        }

        public async Task Create(List<RoleInDepartment> model) => await _dao.Create(model);

        public async Task Delete(IReadOnlyList<int> ids) => await _dao.Delete(ids);

        public async Task Update(List<RoleInDepartment> models) => await _dao.Update(models);

        public async Task<IEnumerable<RoleInDepartment>> Get(RoleInDepartmentGetOptions options) => await _dao.Get(options);
    }
}