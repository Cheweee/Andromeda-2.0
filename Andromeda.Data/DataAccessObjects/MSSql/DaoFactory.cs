using Andromeda.Data.Interfaces;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.MSSql
{
    public class DaoFactory : IDaoFactory
    {
        private readonly string _connectionString;
        private readonly ILogger _logger;

        public DaoFactory(string connectionString, ILogger logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public IUserDao UserDao => new UserDao(_connectionString, _logger);

        public IDepartmentDao DepartmentDao => new DepartmentDao(_connectionString, _logger);

        public IStudentGroupDao StudentGroupDao => new StudentGroupDao(_connectionString, _logger);

        public IStudyLoadDao StudyLoadDao => new StudyLoadDao(_connectionString, _logger);
        
        public IRoleDao RoleDao => new RoleDao(_connectionString, _logger);

        public IRoleInDepartmentDao RoleInDepartmentDao => new RoleInDepartmentDao(_connectionString, _logger);

        public IUserRoleInDepartmentDao UserRoleInDepartment => new UserRoleInDepartmentDao(_connectionString, _logger);
    }
}