using System.Collections.Generic;
using Andromeda.Data.Enumerations;

namespace Andromeda.Data.Models
{
    public class StudyLoad
    {
        public int Id { get; set; }
        public int FacultyId { get; set; }
        public int DepartmentId { get; set; }
        public int DepartmentLoadId { get; set; }
        public int DisciplineTitleId { get; set; }
        public int SemesterNumber { get; set; }
        public int StudyWeeksCount { get; set; }
        public int GroupsInTheStream { get; set; }
        public int StudentGroupId { get; set; }
        public int? UserId { get; set; }
        public double Value { get; set; }
        public ProjectType ProjectType { get; set; }

        public User User { get; set; }
        public Department Faculty { get; set; }
        public Department Department { get; set; }
        public DisciplineTitle DisciplineTitle { get; set; }
        public StudentGroup StudentGroup { get; set; }
    }

    public class StudyLoadGetOptions
    {
        public int? DepartmentLoadId { get; set; }
        public IReadOnlyList<int> DepartmentLoadsIds { get; set; }
        public bool? OnlyNotDistibuted { get; set; }
        public bool? OnlyDistributed { get; set; }
    }
}