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
    public class RoleDao : BaseDao, IRoleDao
    {
        public RoleDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(Role model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create role query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into Role (
                            Name
                        ) values (
                            @name
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create role query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete roles query");
                await ExecuteAsync(@"
                    delete from Role
                    where Id in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete roles query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<Role>> Get(RoleGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get roles sql query");

                sql.AppendLine(@"
                    select 
                        Id,
                        Name
                    from Role
                ");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (Id = @id)");
                }
                if (options.Ids != null && options.Ids.Count > 0)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (Id in @ids)");
                }
                if (!string.IsNullOrEmpty(options.NormalizedSearch))
                {
                    sql.AppendLine($@"
                        {(conditionIndex++ == 0 ? "where" : "and")} (lower(Name) like lower(@NormalizedSearch))
                    ");
                }
                if(!string.IsNullOrEmpty(options.Name))
                {
                    sql.AppendLine($@"
                        {(conditionIndex++ == 0 ? "where" : "and")} (Name = @Name)
                    ");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get roles query");
                var result = await QueryAsync<Role>(sql.ToString(), options);
                _logger.LogInformation("Sql get roles query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(Role model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update role query");
                await ExecuteAsync(@"
                    update Role set
                        Name = @Name
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update role query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}