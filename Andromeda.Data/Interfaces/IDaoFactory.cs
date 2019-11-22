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
    }
}