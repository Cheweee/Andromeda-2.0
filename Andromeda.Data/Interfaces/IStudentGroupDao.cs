using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IStudentGroupDao
    {
        Task<IEnumerable<StudentGroup>> Get(StudentGroupGetOptions options);
        Task Create(StudentGroup model);
        Task Update(StudentGroup model);
        Task Delete(IReadOnlyList<int> ids);
    }
}