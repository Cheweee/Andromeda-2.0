using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IDepartmentDao
    {        
        Task<IEnumerable<Department>> Get(DepartmentGetOptions options);
        Task Create(Department model);
        Task Update(Department model);
        Task Delete(IReadOnlyList<int> ids);
    }
}