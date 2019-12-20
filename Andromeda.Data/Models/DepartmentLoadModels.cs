using System.Collections.Generic;

namespace Andromeda.Data.Models
{
    public class DepartmentLoad
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string StudyYear { get; set; }
        public double TotalLoad { get; set; }

        public IEnumerable<StudyLoad> StudyLoad { get; set; }
    }

    public class DepartmentLoadGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
    }
}