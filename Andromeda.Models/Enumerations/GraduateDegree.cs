using System.ComponentModel;

namespace Andromeda.Models.Enumerations
{
    ///<summary> Перечисление ученых степеней </summary>
    public enum GraduateDegree
    {
        [Description("Кандидат наук")]
        ///<summary> Кандидат наук </summary>
        CandidatOfSciences,
        [Description("Доктор наук")]
        ///<summary> Доктор наук </summary>
        DoctorOfSciences
    }
}