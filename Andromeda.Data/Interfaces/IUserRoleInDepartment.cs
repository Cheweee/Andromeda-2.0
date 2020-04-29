using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IUserRoleInDepartmentDao
    {        
        Task<IEnumerable<UserRoleInDepartment>> Get(UserRoleInDepartmentGetOptions options);
        Task Create(List<UserRoleInDepartment> models);
        Task Delete(IReadOnlyList<int> ids);
        Task Update(List<UserRoleInDepartment> models);
    }
}