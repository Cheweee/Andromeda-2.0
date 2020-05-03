using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IUserLoadDao
    {
        Task<IEnumerable<UserLoad>> Get(UserLoadGetOptions options);
        Task Create(List<UserLoad> model);
        Task Update(List<UserLoad> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}