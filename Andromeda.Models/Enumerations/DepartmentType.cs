using Andromeda.Shared;

namespace Andromeda.Models.Enumerations
{
    ///<summary> Перечисление типов департаментов в ВУЗе </summary>
    public enum DepartmentType {
        [EnumerationDescription("Факультеты и институты")]
        ///<summary> Факультет или институт </summary>
        Faculty,
        [EnumerationDescription("Кафедры")]
        ///<summary> Каферда </summary>
        TrainingDepartment
    }
}