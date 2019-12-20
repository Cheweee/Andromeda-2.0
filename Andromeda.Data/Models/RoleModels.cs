using System.Collections.Generic;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<RoleInDepartment> RoleDepartments { get; set; }
    }

    public class RoleInDepartment
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int DepartmentId { get; set; }
        public DepartmentType DepartmentType { get; set; }
        public string RoleName { get; set; }
        public string DepartmentName { get; set; }
    }

    public class UserRoleInDepartment
    {
        public int Id { get; set; }
        public int RoleInDepartmentId { get; set; }
        public int RoleId { get; set; }
        public int DepartmentId { get; set; }
        public int UserId { get; set; }

        public string RoleName { get; set; }
        public string DepartmentName { get; set; }
        public string UserFullName { get; set; }
    }

    public class RoleGetOptions : BaseGetOptions
    {
        public string NormalizedSearch => !string.IsNullOrEmpty(Search) ? $"%{Search}%" : string.Empty;
        public string Search { get; set; }
        public string Name { get; set; }
    }

    public class RoleInDepartmentGetOptions
    {
        public int? RoleId { get; set; }
        public IReadOnlyList<int> RoleIds { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
        public int? DeparmtentId { get; set; }
    }

    public class UserRoleInDepartmentGetOptions
    {
        public int? DepartmentId { get; set; }

        public IReadOnlyList<int> RoleIds { get; set; }
        public IReadOnlyList<int> UserIds { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
    }
}