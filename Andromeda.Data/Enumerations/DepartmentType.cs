using Andromeda.Shared;

namespace Andromeda.Data.Enumerations
{
    public enum DepartmentType {
        [EnumerationDescription("Факультеты и институты")]
        Faculty,
        [EnumerationDescription("Кафедры")]
        TrainingDepartment
    }
}