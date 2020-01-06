using System.Collections.Generic;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data.Models
{
    public class DisciplineTitle
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Shortname { get; set; }
        public bool Pinned { get; set; }
        public int DepartmentId { get; set; }

        public ProjectType? PinnedProjectType { get; set; }
        public List<ProjectType> NotPinnedProjectTypes { get; set; }
    }

    public class DisciplineTitleGetOptions : BaseGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
        public IReadOnlyList<string> Titles { get; set; }
        public bool? NotPinned { get; set; }
    }
}