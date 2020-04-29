using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces {
    public interface IDisciplineTitleDao
    {        
        Task<IEnumerable<DisciplineTitle>> Get(DisciplineTitleGetOptions options);
        Task Create(List<DisciplineTitle> model);
        Task Update(List<DisciplineTitle> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}