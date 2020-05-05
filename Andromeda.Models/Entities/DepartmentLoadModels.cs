using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using Andromeda.Models.Enumerations;

namespace Andromeda.Models.Entities
{
    ///<summary> Учебная нагурзка кафедры на один учебный год </summary>
    public class DepartmentLoad
    {
        ///<summary> Ключ учебной нагрузки кафедры </summary>
        public int Id { get; set; }
        ///<summary> Ключ кафедры, для которой составляется нагрузка </summary>
        public int DepartmentId { get; set; }
        ///<summary> Учебный год </summary>
        public string StudyYear { get; set; }
        ///<summary> Всего часов нагрузки </summary>
        public double Total { get; set; }

        ///<summary> Коллекция нагрузки дисциплин на группы </summary>
        public List<GroupDisciplineLoad> GroupDisciplineLoad { get; set; } = new List<GroupDisciplineLoad>();
    }

    ///<summary> Опции для получения нагрузки кафедры </summary>
    public class DepartmentLoadGetOptions : BaseGetOptions
    {
        ///<summary> Ключ кафедры </summary>
        public int? DepartmentId { get; set; }
        ///<summary> Ключи кафедр </summary>
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

        public List<UserLoad> UsersLoad { get; set; }
    }

    public class StudyLoadGetOptions
    {
        public int? GroupDisciplineLoadId { get; set; }
        public IReadOnlyList<int> GroupDisciplineLoadsIds { get; set; }
        public bool? OnlyNotDistibuted { get; set; }
        public bool? OnlyDistributed { get; set; }
    }

    public class UserLoad
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int StudyLoadId { get; set; }
        public int StudentsCount { get; set; }

        public User User { get; set; }
    }

    public class UserLoadGetOptions
    {
        public int? StudyLoadId { get; set; }
        public IReadOnlyList<int> StudyLoadsIds { get; set; }
        public int? UserId { get; set; }
        public IReadOnlyList<int> UsersIds { get; set; }
    }

    ///<summary> Опции импорта нагрузки кафедры из Excel файла </summary>
    public class DepartmentLoadImportOptions
    {
        ///<summary> Ключ кафедры </summary>
        public int? DepartmentId { get; set; }
        ///<summary> Имя файла </summary>
        public string FileName { get; set; }
        ///<summary> Необходимо обновить наименования дисциплин на кафедре или нет </summary>
        public bool UpdateDisciplinesTitles { get; set; }
        ///<summary> Необходимо обновить группы студентов на кафедре или нет </summary>
        public bool UpdateStudentsGroups { get; set; }
    }

    ///<summary> Коэффициенты для распределния учебной нагрузки </summary>
    public class GenerateRatio
    {
        ///<summary> Ключ учебной нагрузки </summary>
        public int StudyLoadId { get; set; }

        ///<summary> Словарь коэффициентов где ключ - ключ пользователя, а значение - коллекция коэффициентов </summary>
        public Dictionary<User, double> Ratios { get; set; }
    }

    ///<summary> Опции для алгоритма автоматического рапспределения нагрузки </summary>
    public class DepartmentLoadGenerateOptions
    {
        ///<summary> Использовать стаж преподавателя для расчета или нет </summary>
        public bool? UseTeachingExperience { get; set; }
        ///<summary> Использовать методические разработки преподавателя для расчета или нет </summary>
        public bool? UseMethodicalDevelopments { get; set; }
        ///<summary> Использовать результаты сессия для расчета или нет </summary>
        public bool? UseFinalTestsResults { get; set; }
        ///<summary> Использовать результаты независимой аттестации студентов для расчета или нет </summary>
        public bool? UseIndependetTestsResults { get; set; }
        ///<summary> Использовать ученые степени для расчета или нет </summary>
        public bool? UseGraduateDegrees { get; set; }
        ///<summary> Использовать закрепленные за преподавателем дисциплины для расчета или нет </summary>
        public bool? UsePinnedDisciplines { get; set; }

        ///<summary> Нагрузка кафедры, для которой будет применен алгоритм расчета </summary>
        public DepartmentLoad departmentLoad { get; set; }
    }
}