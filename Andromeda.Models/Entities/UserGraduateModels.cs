using System.Collections.Generic;
using Andromeda.Models.Enumerations;

namespace Andromeda.Models.Entities
{
    ///<summary> Ученые степени пользователя </summary>
    public class UserGraduateDegree
    {
        ///<summary> Ключ ученой степени пользователя </summary>
        public int Id { get; set; }
        ///<summary> Ключ пользователя </summary>
        public int UserId { get; set; }
        ///<summary> Ученая степень </summary>
        public GraduateDegree GraduateDegree { get; set; }
        ///<summary> Отрасль науки </summary>
        public BranchOfScience BranchOfScience { get; set; }

        ///<summary> Пользователь </summary>
        public User User { get; set; }
    }

    ///<summary> Модель опций для получения ученых степеней пользователей </summary>
    public class UserGraduateDegreeGetOptions
    {
        ///<summary> Ключ пользователя, которому принадлежит ученая степень </summary>
        public int? UserId { get; set; }
        ///<summary> Ключи пользователей, которым принадлежат ученые степени </summary>
        public IReadOnlyList<int> UsersIds { get; set; }
    }
}