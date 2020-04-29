using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

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

        public async Task<List<StudentGroup>> Create(List<StudentGroup> models)
        {
            await _dao.Create(models);

            return models;
        }

        public async Task<List<StudentGroup>> Update(List<StudentGroup> models)
        {
            await _dao.Update(models);

            return models;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }
    }
}