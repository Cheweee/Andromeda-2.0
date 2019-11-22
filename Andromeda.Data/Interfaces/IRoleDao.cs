using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IRoleDao
    {        
        Task<IEnumerable<Role>> Get(RoleGetOptions options);
        Task Create(Role model);
        Task Update(Role model);
        Task Delete(IReadOnlyList<int> ids);
    }
}