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
    public class PinnedDisciplineDao : BaseDao, IPinnedDisciplineDao
    {
        public PinnedDisciplineDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<PinnedDiscipline> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create pinned discipline query");
                await ExecuteAsync(@"
                        insert into PinnedDiscipline (
                            UserId,
                            DisciplineTitleId,
                            ProjectType
                        ) values (
                            @UserId,
                            @DisciplineTitleId,
                            @ProjectType
                        );
                ", model);
                _logger.LogInformation("Sql create pinned discipline query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete pinned disciplines query");
                await ExecuteAsync(@"
                    delete from PinnedDiscipline
                    where Id in @Ids
                ", new { ids });
                _logger.LogInformation("Sql delete pinned disciplines query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<PinnedDiscipline>> Get(PinnedDisciplineGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get pinned disciplines sql query");

                sql.AppendLine(@"
                    select 
                        pd.Id,
                        pd.UserId,
                        pd.DisciplineTitleId,
                        pd.ProjectType,
                        dt.Name as DisciplineTitle
                    from PinnedDiscipline pd
                    left join DisciplineTitle dt on DisciplineTitleId = dt.Id");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.Id = @id");
                }
                if(options.UserId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.UserId = @UserId");
                }
                if (options.DisciplineTitleId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.DisciplineTitleId = @DisciplineTitleId");
                }
                if (options.Ids != null && options.Ids.Count > 0)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.Id in @Ids");
                }
                if (options.DisciplineTitlesIds != null && options.DisciplineTitlesIds.Count > 0)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.DisciplineTitleId in @DisciplineTitlesIds");
                }
                if (options.UsersIds != null && options.UsersIds.Count > 0)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.UserId in @UsersIds");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get pinned disciplines query");
                var result = await QueryAsync<PinnedDiscipline>(sql.ToString(), options);
                _logger.LogInformation("Sql get pinned disciplines query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<PinnedDiscipline> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update pinned discipline query");
                await ExecuteAsync(@"
                    update PinnedDiscipline set
                        UserId = @UserId,
                        DisciplineTitleId = @DisciplineTitleId,
                        ProjectType = @ProjectType
                    from PinnedDiscipline
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update pinned discipline query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}