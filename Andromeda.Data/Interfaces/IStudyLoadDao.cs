using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IStudyLoadDao
    {        
        Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options);
        Task Create(List<StudyLoad> model);
        Task Update(List<StudyLoad> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}