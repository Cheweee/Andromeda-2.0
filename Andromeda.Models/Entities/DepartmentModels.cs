using System.Collections.Generic;
using Andromeda.Models.Enumerations;

namespace Andromeda.Models.Entities
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FullName { get; set; }
        public int? ParentId { get; set; }
        public Department Parent { get; set; }
        public DepartmentType Type { get; set; }

        public List<Department> ChildDepartments { get; set; }
        public List<DisciplineTitle> Titles { get; set; }
        public List<RoleInDepartment> Roles { get; set; }
        public List<UserRoleInDepartment> Users { get; set; }
        public List<StudyDirection> StudyDirections { get; set; }
        public List<StudentGroup> Groups { get; set; }
        public List<DepartmentLoad> DepartmentLoads { get; set; }
    }

    public class DepartmentGetOptions : BaseGetOptions
    {
        public int? ParentId { get; set; }
        public string NormalizedSearch => !string.IsNullOrEmpty(Search) ? $"%{Search}%" : string.Empty;
        public string Search { get; set; }
        public DepartmentType? Type { get; set; }
        public string FullName { get; set; }
        public int? RoleId { get; set; }

        public IReadOnlyList<string> Names { get; set; }
    }
}