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
    public class RoleInDepartmentDao : BaseDao, IRoleInDepartmentDao
    {
        public RoleInDepartmentDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<RoleInDepartment> models)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create department query");
                await ExecuteAsync(@"
                        insert into [RoleInDepartment] (
                            [RoleId],
                            [DepartmentId]
                        )
                        values (
                            @RoleId,
                            @DepartmentId
                        );
                ", models);
                _logger.LogInformation("Sql create department query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete departments query");
                await ExecuteAsync(@"
                    delete from [RoleInDepartment]
                    where [Id] in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete departments query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<RoleInDepartment>> Get(RoleInDepartmentGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get departments sql query");

                sql.AppendLine(@"
                    select 
                        rid.Id,
                        r.Id as RoleId,
                        d.Id as DepartmentId,
                        d.Type as DepartmentType,
                        r.Name as RoleName,
                        d.FullName as DepartmentName
                    from RoleInDepartment rid
                    left join Role r on rid.RoleId = r.Id
                    left join Department d on rid.DepartmentId = d.Id
                ");

                int conditionIndex = 0;
                if (options.RoleId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.RoleId = @RoleId)");
                }
                if (options.DeparmtentId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.DepartmentId = @DepartmentId)");
                }
                if(options.RoleIds != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.RoleId in @RoleIds)");
                }
                if(options.DepartmentIds != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rid.DepartmentId in @DepartmentIds)");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get departments query");
                var result = await QueryAsync<RoleInDepartment>(sql.ToString(), options);
                _logger.LogInformation("Sql get departments query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}