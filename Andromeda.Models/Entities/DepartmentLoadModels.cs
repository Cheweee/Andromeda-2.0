using System.Collections.Generic;
using Andromeda.Models.Enumerations;

namespace Andromeda.Models.Entities
{
    public class DepartmentLoad
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string StudyYear { get; set; }
        public double Total { get; set; }

        public List<GroupDisciplineLoad> GroupDisciplineLoad { get; set; } = new List<GroupDisciplineLoad>();
    }

    public class DepartmentLoadGetOptions : BaseGetOptions
    {
        public int? DepartmentId { get; set; }
        public IReadOnlyList<int> DepartmentIds { get; set; }
    }

    public class GroupDisciplineLoad
    {
        public int Id { get; set; }
        public int DepartmentLoadId { get; set; }
        public int DisciplineTitleId { get; set; }
        public int StudentGroupId { get; set; }
        public int FacultyId { get; set; }
        public int SemesterNumber { get; set; }
        public int StudyWeeksCount { get; set; }
        public double Amount { get; set; }

        public DepartmentLoad DepartmentLoad { get; set; }
        public DisciplineTitle DisciplineTitle { get; set; }
        public StudentGroup StudentGroup { get; set; }
        public Department Faculty { get; set; }

        public List<StudyLoad> StudyLoad { get; set; }
    }

    public class GroupDisciplineLoadGetOptions
    {
        public int? DepartmentLoadId { get; set; }
        public IReadOnlyList<int> DepartmentLoadsIds { get; set; }
    }

    public class StudyLoad
    {
        public int Id { get; set; }
        public int GroupDisciplineLoadId { get; set; }
        public string ShownValue { get; set; }
        public double Value { get; set; }
        public ProjectType ProjectType { get; set; }
    }

    public class StudyLoadGetOptions
    {
        public int? GroupDisciplineLoadId { get; set; }
        public IReadOnlyList<int> GroupDisciplineLoadsIds { get; set; }
        public bool? OnlyNotDistibuted { get; set; }
        public bool? OnlyDistributed { get; set; }
    }

    public class DepartmentLoadImportOptions
    {
        public int? DepartmentId { get; set; }
        public string FileName { get; set; }
        public bool UpdateDisciplinesTitles { get; set; }
        public bool UpdateStudentsGroups { get; set; }
    }
}