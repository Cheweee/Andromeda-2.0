using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IDepartmentLoadDao
    {        
        Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options);
        Task Create(DepartmentLoad model);
        Task Update(DepartmentLoad model);
        Task Delete(IReadOnlyList<int> ids);
    }
}