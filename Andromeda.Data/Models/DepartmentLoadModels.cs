using System.Collections.Generic;
using System.Linq;

namespace Andromeda.Data.Models
{
    public class DepartmentLoad
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string StudyYear { get; set; }
        public double TotalLoad => StudyLoad.Select(o => o.Value).Sum();

        public IEnumerable<StudyLoad> StudyLoad { get; set; } = new List<StudyLoad>();
    }

    public class DepartmentLoadGetOptions : BaseGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
    }

    public class DepartmentLoadImportOptions
    {
        public int? DepartmentId { get; set; }
        public string FileName { get; set; }
        public bool UpdateDisciplinesTitles { get; set; }
        public bool UpdateStudentsGroups { get; set; }
    }
}