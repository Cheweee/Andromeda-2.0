using System.Collections.Generic;

namespace Andromeda.Data.Models
{
    public class StudyLoad
    {
        public int Id { get; set; }
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
        public string SubjectName { get; set; }
        public int SemesterNumber { get; set; }
        public int StudyWeeksCount { get; set; }
        public int GroupsInTheStream { get; set; }
        public int? Lections { get; set; }
        public int? PracticalWorks { get; set; }
        public int? LaboratoryWorks { get; set; }
        public int? ThematicalDiscussions { get; set; }
        public int? Consultations { get; set; }
        public int? Exams { get; set; }
        public int? Offsets { get; set; }
        public int? ControlWorks { get; set; }
        public int? Abstracts { get; set; }
        public int? ESControlWorks { get; set; }
        public int? StateExams { get; set; }
        public int? PSEntryExams { get; set; }
        public int? Practices { get; set; }
        public int? DepartmentManagement { get; set; }
        public int? ResearchWorks { get; set; }
        public int? CourseWorks { get; set; }
        public int? GraduationWorkManagement { get; set; }
        public int? MasterProgramManagement { get; set; }
        public int? UndergraduateProgramManagement { get; set; }

        public IEnumerable<StudentGroup> Groups { get; set; }
    }

    public class StudyLoadGetOptions : BaseGetOptions
    {
        public string Search { get; set; }
    }
}