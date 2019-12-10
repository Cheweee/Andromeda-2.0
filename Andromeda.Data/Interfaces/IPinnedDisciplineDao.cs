using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{    
    public interface IPinnedDisciplineDao
    {
        Task<IEnumerable<PinnedDiscipline>> Get(PinnedDisciplineGetOptions options);
        Task Create(List<PinnedDiscipline> model);
        Task Update(List<PinnedDiscipline> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}