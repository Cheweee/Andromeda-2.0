using System.Collections.Generic;

namespace Andromeda.Models.Entities
{
    public class StudyDirection
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string Code { get; set; }
        public string ShortName { get; set; }
        public string Name { get; set; }
    }

    public class StudyDirectionGetOptions : BaseGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
        public IReadOnlyList<string> Names { get; set; }
    }
}