using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class UserRoleInDepartmentService
    {
        private readonly IUserRoleInDepartmentDao _dao;

        public UserRoleInDepartmentService(IUserRoleInDepartmentDao dao)
        {
            _dao = dao ?? throw new ArgumentException(nameof(dao));
        }

        public async Task Create(List<UserRoleInDepartment> models) => await _dao.Create(models);

        public async Task Delete(IReadOnlyList<int> ids) => await _dao.Delete(ids);

        public async Task<IEnumerable<UserRoleInDepartment>> Get(UserRoleInDepartmentGetOptions options) => await _dao.Get(options);

        public async Task Update(List<UserRoleInDepartment> models) => await _dao.Update(models);
    }
}