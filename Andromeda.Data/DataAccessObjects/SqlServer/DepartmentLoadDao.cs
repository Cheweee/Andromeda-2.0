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
    public class DepartmentLoadDao : BaseDao, IDepartmentLoadDao
    {
        public DepartmentLoadDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger)
        {
        }

        public async Task Create(DepartmentLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create department load query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into DepartmentLoad (
                            DepartmentId,
                            StudyYear,
                            Total
                        ) values (
                            @DepartmentId,
                            @StudyYear,
                            @Total
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create department load query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete departments loads query");
                await ExecuteAsync(@"
                    delete from DepartmentLoad
                    where Id in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete departments loads query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<DepartmentLoad>> Get(DepartmentLoadGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get department loads sql query");

                sql.AppendLine(@"
                    select 
                    	Id,
                    	StudyYear,
                    	DepartmentId,
                        Total
                    from DepartmentLoad
                ");

                int conditionIndex = 0;
                if(options.Id.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} Id = @Id");
                if (options.DepartmentId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} DepartmentId = @DepartmentId");
                if (options.DepartmentIds != null)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} DepartmentId in @DepartmentIds");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get departments loads query");
                var result = await QueryAsync<DepartmentLoad>(sql.ToString(), options);
                _logger.LogInformation("Sql get departments loads query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(DepartmentLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update department load query");
                await ExecuteAsync(@"
                    update DepartmentLoad set
                        DepartmentId = @DepartmentId,
                        StudyYear = @StudyYear,
                        Total = @Total
                    from DepartmentLoad
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update department load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}