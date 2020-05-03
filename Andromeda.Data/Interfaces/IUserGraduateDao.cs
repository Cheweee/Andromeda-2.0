using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IUserGraduateDegreeDao
    {
        Task<IEnumerable<UserGraduateDegree>> Get(UserGraduateDegreeGetOptions options);
        Task Create(List<UserGraduateDegree> model);
        Task Update(List<UserGraduateDegree> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}