using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;
using Andromeda.Models.Settings;

namespace Andromeda.Data.DataAccessObjects
{
    public class UserDao : BaseDao, IUserDao
    {
        public UserDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(User model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create user query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into [User] (
                            [Username],
                            [Firstname],
                            [Secondname],
                            [Lastname],
                            [Email],
                            [PasswordHash]
                        )
                        values (
                            @username,
                            @firstname,
                            @secondname,
                            @lastname,
                            @email,
                            pwdencrypt(@password)
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create user query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql delete users query");
                await ExecuteAsync(@"
                    delete from [User]
                    where [Id] in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete users query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<User>> Get(UserGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get users sql query");

                sql.AppendLine(@"
                    select distinct
                           u.[Id]
                         , u.[Username]
                         , u.[Firstname]
                         , u.[Secondname]
                         , u.[Lastname]
                         , u.[Email]
                    from [User] u
                ");

                if (options.OnlyWithPinnedDisciplines.HasValue && options.OnlyWithPinnedDisciplines.Value)
                    sql.AppendLine("join [PinnedDiscipline] pd on pd.UserId = u.Id");

                if (options.CanTeach.HasValue || options.DepartmentId.HasValue)// && options.CanTeach.Value)
                {
                    sql.AppendLine("join [UserRoleInDepartment] urid on urid.UserId = u.Id");
                    if (options.DepartmentId.HasValue)
                    {
                        sql.AppendLine("join [RoleInDepartment] rid on rid.Id = urid.RoleInDepartmentId and rid.DepartmentId = @DepartmentId");
                    }
                    else
                    {
                        sql.AppendLine("join [RoleInDepartment] rid on rid.Id = urid.RoleInDepartmentId");
                    }
                    if (options.CanTeach.HasValue)
                        sql.AppendLine("join [Role] r on r.Id = rid.RoleId and r.CanTeach = 1");

                    // sql.AppendLine(@"
                    //     join [UserRoleInDepartment] urid on urid.UserId = u.Id
                    //     join [RoleInDepartment] rid on rid.Id = urid.RoleInDepartmentId
                    //     join [Role] r on r.Id = rid.RoleId and r.CanTeach = 1
                    // ");
                }

                int conditionIndex = 0;
                if (options.Id.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} [Id] = @id");
                }
                if (options.Ids != null && options.Ids.Count > 0)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} [Id] in @ids");
                }
                if (!string.IsNullOrEmpty(options.NormalizedSearch))
                {
                    sql.AppendLine($@"
                        {(conditionIndex++ == 0 ? "where" : "and")} lower([Firstname]) like lower(@NormalizedSearch)
                        or lower([Secondname]) like lower(@NormalizedSearch)
                        or lower([Lastname]) like lower(@NormalizedSearch)
                        or lower([Email]) like lower(@NormalizedSearch)
                        or lower([Username]) like lower(@NormalizedSearch)
                    ");
                }
                if (!string.IsNullOrEmpty(options.Username))
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} [Username] = @username");
                }
                if (!string.IsNullOrEmpty(options.Email))
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} [Email] = @email");
                }

                sql.AppendLine("order by u.Lastname, u.Firstname, u.Secondname");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get users query");
                var result = await QueryAsync<User>(sql.ToString(), options);
                _logger.LogInformation("Sql get users query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<AuthenticatedUser>> Get(UserAuthorizeOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get users sql query");

                sql.AppendLine(@"
                    select 
                        [Id],
                        [Username],
                        [Firstname],
                        [Secondname],
                        [Lastname],
                        [Email]
                    from [User]
                ");

                int conditionIndex = 0;
                if (!string.IsNullOrEmpty(options.Username))
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} ([Username] = @username)");
                }
                if (!string.IsNullOrEmpty(options.Password))
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (pwdcompare(@password, [PasswordHash]) = 1)");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get users query");
                var result = await QueryAsync<AuthenticatedUser>(sql.ToString(), options);
                _logger.LogInformation("Sql get users query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(User model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update user query");
                await ExecuteAsync(@"
                    update [User] set
                        [Username] = @Username, 
                        [Secondname] = @Secondname,
                        [Firstname] = @Firstname, 
                        [Lastname] = @Lastname, 
                        [Email] = @Email
                    where [Id] = @id
                ", model);
                _logger.LogInformation("Sql update user query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}