using Andromeda.Shared;

namespace Andromeda.Models.Enumerations
{
    public enum DepartmentType {
        [EnumerationDescription("Факультеты и институты")]
        Faculty,
        [EnumerationDescription("Кафедры")]
        TrainingDepartment
    }
}