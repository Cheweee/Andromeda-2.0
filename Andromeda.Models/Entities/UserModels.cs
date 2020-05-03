using System;
using System.Collections.Generic;

namespace Andromeda.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Secondname { get; set; }
        public string Lastname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateUpdated { get; set; }

        public List<PinnedDiscipline> PinnedDisciplines { get; set; }
        public List<Department> Departments { get; set; }
    }

    public class AuthenticatedUser : User
    {
        public string Token { get; set; }
    }

    public class UserGetOptions : BaseGetOptions
    {
        public string NormalizedSearch => !string.IsNullOrEmpty(Search) ? $"%{Search}%" : string.Empty;
        public string Search { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public int? DepartmentId { get; set; }
    }

    public class UserAuthorizeOptions
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}