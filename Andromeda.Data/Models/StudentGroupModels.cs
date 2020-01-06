using System.Collections.Generic;

namespace Andromeda.Data.Models
{
    public class StudentGroup
    {
        public int Id { get; set; }

        public int StudyDirectionId { get; set; }

        public string Name { get; set; }

        public int StudentsCount { get; set; }

        public int StartYear { get; set; }

        public int CurrentCourse { get; set; }

        public int DepartmentId { get; set; }

        public StudyDirection StudyDirection { get; set; }
    }

    public class StudentGroupGetOptions : BaseGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
        public IReadOnlyList<string> Names { get; set; }
        public string Search { get; set; }
    }
}