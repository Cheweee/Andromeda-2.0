using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IStudyLoadDao
    {        
        Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options);
        Task Create(StudyLoad model);
        Task Update(StudyLoad model);
        Task Delete(IReadOnlyList<int> ids);
    }
}