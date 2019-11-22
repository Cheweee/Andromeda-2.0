using System.Collections.Generic;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public int? ParentId { get; set; }
        public Department Parent { get; set; }
        public DepartmentType Type { get; set; }

        public List<RoleInDepartment> DepartmentRoles { get; set; }
        public List<UserRoleInDepartment> DepartmentUsers { get; set; }
    }

    public class DepartmentGetOptions : BaseGetOptions
    {
        public int? ParentId { get; set; }
        public string NormalizedSearch => !string.IsNullOrEmpty(Search) ? $"%{Search}%" : string.Empty;
        public string Search { get; set; }
        public DepartmentType? Type { get; set; }
        public string FullName { get; set; }
        public int? RoleId { get; set; }
    }
}