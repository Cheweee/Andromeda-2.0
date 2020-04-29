using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IStudyDirectionDao
    {
        Task<IEnumerable<StudyDirection>> Get(StudyDirectionGetOptions options);
        Task Create(List<StudyDirection> model);
        Task Update(List<StudyDirection> model);
        Task Delete(IReadOnlyList<int> ids);        
    }
}