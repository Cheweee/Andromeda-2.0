using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IRoleInDepartmentDao
    {
        Task<IEnumerable<RoleInDepartment>> Get(RoleInDepartmentGetOptions options);
        Task Create(List<RoleInDepartment> models);
        Task Update(List<RoleInDepartment> models);
        Task Delete(IReadOnlyList<int> ids);
    }
}