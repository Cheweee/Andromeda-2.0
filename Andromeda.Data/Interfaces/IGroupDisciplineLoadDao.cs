using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces {
    public interface IGroupDisciplineLoadDao
    {        
        Task<IEnumerable<GroupDisciplineLoad>> Get(GroupDisciplineLoadGetOptions options);
        Task Create(GroupDisciplineLoad model);
        Task Update(GroupDisciplineLoad model);
        Task Delete(IReadOnlyList<int> ids);
    }
}