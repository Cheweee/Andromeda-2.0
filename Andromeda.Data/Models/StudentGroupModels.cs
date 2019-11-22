namespace Andromeda.Data.Models
{
    public class StudentGroup
    {
        public int Id { get; set; }

        public string StudyDirection { get; set; }

        public string Name { get; set; }

        public int StudentsCount { get; set; }

        public int StartYear { get; set; }

        public int CurrentCourse { get; set; }

        public int DepartmentId { get; set; }

        public int StudyLoadId { get; set; }
    }

    public class StudentGroupGetOptions : BaseGetOptions
    {
        public string Search { get; set; }
    }
}