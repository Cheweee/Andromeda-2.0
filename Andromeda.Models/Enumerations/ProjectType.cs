namespace Andromeda.Models.Enumerations
{
    ///<summary> Перечисление типов работ по учебной дисциплине. </summary>
    public enum ProjectType
    {
        ///<summary> Лекции </summary>
        Lection,
        ///<summary> Практические занятия </summary>
        PracticalLesson,
        ///<summary> Лабораторные занятия </summary>
        LaboratoryLesson,
        ///<summary> Тематические дискуссии </summary>
        ThematicalDiscussion,
        ///<summary> Консультации </summary>
        Consultation,
        ///<summary> Экзамены </summary>
        Exam,
        ///<summary> Зачеты </summary>
        Offest,
        ///<summary> Рефераты </summary>
        Abstract,
        ///<summary> Контрольные работы ЗФО </summary>
        EsTestPapers,
        ///<summary> Государственные экзамены </summary>
        StateExam,
        ///<summary> Вступительные экзамены в аспирантуру </summary>
        PostgraduateEntranceExam,
        ///<summary> Практика </summary>
        Practice,
        ///<summary> Руководство кафедрой </summary>
        DepartmentManagement,
        ///<summary> Научно-исследовательская работа студента (НИРС) </summary>
        StudentResearchWork,
        ///<summary> Курсовые работы/проекты </summary>
        CourseWork,
        ///<summary> Руководство выпускной кавалификационной работой (ВКР) </summary>
        GraduationQualificationManagement,
        ///<summary>Руководство программой магистратуры</summary>
        MasterProgramManagement,
        ///<summary>Руководство программой аспирантуры</summary>
        PostgraduateProgramManagement,
        ///<summary> Контрольные, РГР, ДЗ и др. </summary>
        Other
    }
}