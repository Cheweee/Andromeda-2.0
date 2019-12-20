namespace Andromeda.Data.Interfaces
{
    public interface IDaoFactory
    {
        IUserDao UserDao { get; }
        IDepartmentDao DepartmentDao { get; }
        IStudentGroupDao StudentGroupDao { get; }
        IStudyLoadDao StudyLoadDao { get; }
        IRoleDao RoleDao { get; }
        IRoleInDepartmentDao RoleInDepartmentDao { get; }
        IUserRoleInDepartmentDao UserRoleInDepartment { get; }
        IStudyDirectionDao StudyDirectionDao { get; }
        IDisciplineTitleDao DisciplineTitleDao { get; }
        IPinnedDisciplineDao PinnedDisciplineDao { get; }
        IDepartmentLoadDao DepartmentLoadDao { get; }
    }
}