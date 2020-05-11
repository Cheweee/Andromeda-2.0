using System;
using System.Collections.Generic;

namespace Andromeda.Models.Entities
{
    ///<summary> Модель пользователя системы </summary>
    public class User
    {
        ///<summary> Ключ пользователя </summary>
        public int Id { get; set; }
        ///<summary> Логин </summary>
        public string Username { get; set; }
        ///<summary> Имя </summary>
        public string Firstname { get; set; }
        ///<summary> Отчество </summary>
        public string Secondname { get; set; }
        ///<summary> Фамилия </summary>
        public string Lastname { get; set; }
        ///<summary> Пароль </summary>
        public string Password { get; set; }
        ///<summary> e-mail </summary>
        public string Email { get; set; }
        ///<summary> Дата создания </summary>
        public DateTime DateCreated { get; set; }
        ///<summary> Дата последнего обновления </summary>
        public DateTime DateUpdated { get; set; }

        ///<summary> Коллекция закрепленных дисциплин </summary>
        public List<PinnedDiscipline> PinnedDisciplines { get; set; }
        ///<summary> Коллекция ученых званий </summary>
        public List<UserGraduateDegree> GraduateDegrees { get; set; }
    }

    ///<summary> Модель аутентифицированного пользователя </summary>
    public class AuthenticatedUser : User
    {
        ///<summary> Шифрованный токен пользователя </summary>
        public string Token { get; set; }
    }

    ///<summary> Опции для получения коллекции пользователей </summary>
    public class UserGetOptions : BaseGetOptions
    {
        ///<summary> Нормализованный поиск для выполнения sql скрипта </summary>
        public string NormalizedSearch => !string.IsNullOrEmpty(Search) ? $"%{Search}%" : string.Empty;
        ///<summary> Поле поиска </summary>
        public string Search { get; set; }
        ///<summary> Логин пользователя </summary>
        public string Username { get; set; }
        ///<summary> e-mail пользователя </summary>
        public string Email { get; set; }
        ///<summary> Пароль пользователя </summary>
        public string Password { get; set; }

        ///<summary> Входит в преподавательский состав или нет </summary>
        public bool? CanTeach { get; set; }
        ///<summary> Только с закрепленными дисциплинами </summary>
        public bool? OnlyWithPinnedDisciplines { get; set; }

        ///<summary> Ключ кафедры </summary>
        public int? DepartmentId { get; set; }
    }

    ///<summary> Опции авторизации пользователя </summary>
    public class UserAuthorizeOptions
    {
        ///<summary> Логин </summary>
        public string Username { get; set; }
        ///<summary> Пароль </summary>
        public string Password { get; set; }
        ///<summary> Запомнить пользователя или нет </summary>
        public bool RememberMe { get; set; }
    }
}