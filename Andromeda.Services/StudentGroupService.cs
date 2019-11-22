using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;

namespace Andromeda.Services
{
    public class StudentGroupService
    {
        private readonly IStudentGroupDao _dao;

        public StudentGroupService(IStudentGroupDao dao)
        {
            _dao = dao;
        }

        public async Task<IEnumerable<StudentGroup>> Get(StudentGroupGetOptions options)
        {
            return await _dao.Get(options);
        }

        public async Task<StudentGroup> Create(StudentGroup model)
        {
            await _dao.Create(model);

            return model;
        }

        public async Task<StudentGroup> Update(StudentGroup model)
        {
            await _dao.Update(model);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }
    }
}