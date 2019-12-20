using System;
using Andromeda.Data.Interfaces;
using Andromeda.Shared;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.SqlServer
{
    public class DaoFactory : IDaoFactory
    {
        private readonly DatabaseConnectionSettings _settings;
        private readonly ILogger _logger;

        public DaoFactory(DatabaseConnectionSettings settings, ILogger logger)
        {
            _settings = settings ?? throw new ArgumentException(nameof(settings));
            _logger = logger ?? throw new ArgumentException(nameof(logger));
        }

        public IUserDao UserDao => new UserDao(_settings, _logger);

        public IDepartmentDao DepartmentDao => new DepartmentDao(_settings, _logger);

        public IStudentGroupDao StudentGroupDao => new StudentGroupDao(_settings, _logger);

        public IStudyLoadDao StudyLoadDao => new StudyLoadDao(_settings, _logger);
        
        public IRoleDao RoleDao => new RoleDao(_settings, _logger);

        public IRoleInDepartmentDao RoleInDepartmentDao => new RoleInDepartmentDao(_settings, _logger);

        public IUserRoleInDepartmentDao UserRoleInDepartment => new UserRoleInDepartmentDao(_settings, _logger);

        public IStudyDirectionDao StudyDirectionDao => new StudyDirectionDao(_settings, _logger);

        public IDisciplineTitleDao DisciplineTitleDao => new DisciplineTitleDao(_settings, _logger);

        public IPinnedDisciplineDao PinnedDisciplineDao => new PinnedDisciplineDao(_settings, _logger);

        public IDepartmentLoadDao DepartmentLoadDao => new DepartmentLoadDao(_settings, _logger);
    }
}