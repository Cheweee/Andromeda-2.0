using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;

namespace Andromeda.Data.Interfaces
{
    public interface IStudentGroupDao
    {
        Task<IEnumerable<StudentGroup>> Get(StudentGroupGetOptions options);
        Task Create(List<StudentGroup> model);
        Task Update(List<StudentGroup> model);
        Task Delete(IReadOnlyList<int> ids);
    }
}