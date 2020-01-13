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
    public class StudyDirectionDao : BaseDao, IStudyDirectionDao
    {
        public StudyDirectionDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<StudyDirection> models)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create study direction query");
                await ExecuteAsync(@"
                        insert into StudyDirection (
                            DepartmentId,
                            Code,
                            Name,
                            ShortName
                        ) values (
                            @DepartmentId,
                            @Code,
                            @Name,
                            @ShortName
                        );
                        select SCOPE_IDENTITY();
                ", models);
                _logger.LogInformation("Sql create study direction query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete study directions query");
                await ExecuteAsync(@"
                    delete from StudyDirection
                    where Id in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete study directions query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<StudyDirection>> Get(StudyDirectionGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get study directions sql query");

                sql.AppendLine(@"
                    select 
                        Id,
                        DepartmentId,
                        Code,
                        Name,
                        ShortName
                    from StudyDirection");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} Id = @id");

                if(options.DepartmentId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} DepartmentId = @DepartmentId");

                if (options.Ids != null && options.Ids.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} Id = any(@ids)");

                if (options.DepartmentIds != null && options.DepartmentIds.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (DepartmentId in @DepartmentIds)");
                    
                if (options.Names != null && options.Names.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (Name in @Names)");
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get study directions query");
                var result = await QueryAsync<StudyDirection>(sql.ToString(), options);
                _logger.LogInformation("Sql get study directions query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<StudyDirection> models)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update study direction query");
                await ExecuteAsync(@"
                    update StudyDirection set
                        DepartmentId = @DepartmentId,
                        Code = @Code,
                        Name = @Name,
                        ShortName = @ShortName
                    from StudyDirection
                    where Id = @Id
                ", models);
                _logger.LogInformation("Sql update study direction query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}