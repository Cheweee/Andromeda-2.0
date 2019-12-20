using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Shared;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.SqlServer
{
    public class UserRoleInDepartmentDao : BaseDao, IUserRoleInDepartmentDao
    {
        public UserRoleInDepartmentDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<UserRoleInDepartment> models)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create user role in department query");
                await ExecuteAsync(@"
                        insert into [UserRoleInDepartment] (
                            [UserId],
                            [RoleInDepartmentId]
                        )
                        values (
                            @UserId,
                            @RoleInDepartmentId
                        );
                ", models);
                _logger.LogInformation("Sql create user role in department query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete users roles in departments query");
                await ExecuteAsync(@"
                    delete from [UserRoleInDepartment]
                    where [Id] in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete users roles in departments query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<UserRoleInDepartment>> Get(UserRoleInDepartmentGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get users roles in departments sql query");

                sql.AppendLine(@"
                    select 
                    	urid.Id,
                        urid.RoleInDepartmentId,
                        urid.UserId,
                        rid.RoleId,
                        rid.DepartmentId,
                        d.Type as DepartmentType,
                        r.Name as RoleName,
                        d.FullName as DepartmentName,
                        (u.Firstname + ' ' + coalesce(u.Secondname + ' ', ' ') + u.Lastname) as UserFullName
                    from [UserRoleInDepartment] urid
                    left join [RoleInDepartment] rid on urid.RoleInDepartmentId = rid.Id
                    left join [User] u on urid.UserId = u.Id
                    left join [Role] r on rid.RoleId = r.Id
                    left join [Department] d on rid.DepartmentId = d.Id
                ");

                int conditionIndex = 0;
                if (options.RoleIds != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.RoleId in @RoleIds)");
                }
                if(options.DepartmentId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.DepartmentId = @DepartmentId)");
                }
                if (options.DepartmentIds != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.DepartmentId in @DepartmentIds)");
                }
                if (options.UserIds != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (urid.UserId in @UserIds)");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get users roles in departments query");
                var result = await QueryAsync<UserRoleInDepartment>(sql.ToString(), options);
                _logger.LogInformation("Sql get users roles in departments query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<UserRoleInDepartment> models)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update user role in department query");
                await ExecuteAsync(@"
                        update [UserRoleInDepartment] set
                            [UserId] = @UserId,
                            [RoleInDepartmentId] = @RoleInDepartmentId
                        where [Id] = @Id
                ", models);
                _logger.LogInformation("Sql update user role in department query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

    }
}