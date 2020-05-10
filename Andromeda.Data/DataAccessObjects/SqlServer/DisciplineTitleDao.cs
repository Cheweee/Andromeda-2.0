using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;
using Andromeda.Models.Settings;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.SqlServer
{
    public class DisciplineTitleDao : BaseDao, IDisciplineTitleDao
    {
        public DisciplineTitleDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<DisciplineTitle> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create discipline title query");
                await ExecuteAsync(@"
                        insert into DisciplineTitle (
                            Name,
                            Shortname,
                            DepartmentId
                        ) values (
                            @Name,
                            @Shortname,
                            @DepartmentId
                        );
                ", model);
                _logger.LogInformation("Sql create discipline title query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete disciplines titles query");
                await ExecuteAsync(@"
                    delete from [DisciplineTitle]
                    where [Id] in @ids;

                    delete from [GroupDisciplineLoad]
                    where [DisciplineTitleId] in @Ids
                ", new { ids });
                _logger.LogInformation("Sql delete disciplines titles query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<DisciplineTitle>> Get(DisciplineTitleGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get discipline titles sql query");

                sql.AppendLine(@"
                    select 
                        distinct
                        dt.Id,
                        dt.Name,
                        dt.Shortname,
                        dt.DepartmentId,
                        pd.ProjectType as PinnedProjectType,
	                    case
	                    	when pd.Id is null then 0
	                    	else 1
	                    end as Pinned
                    from DisciplineTitle dt
                    left join PinnedDiscipline pd on pd.DisciplineTitleId = dt.Id
                    left join GroupDisciplineLoad gdl on gdl.DisciplineTitleId = dt.Id
                ");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.Id = @id");

                if (options.DepartmentId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} dt.DepartmentId = @DepartmentId");

                if (options.NotPinned.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.Id is null");

                if (options.Ids != null && options.Ids.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} pd.Id in @Ids");

                if (options.DepartmentIds != null && options.DepartmentIds.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} dt.DepartmentId in @DepartmentIds");

                if (options.Titles != null && options.Titles.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} dt.Name in @Titles");

                if(options.DepartmentLoadsIds != null && options.DepartmentLoadsIds.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} gdl.DepartmentLoadId in @DepartmentLoadsIds");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get disciplines titles query");
                var result = await QueryAsync<DisciplineTitle>(sql.ToString(), options);
                _logger.LogInformation("Sql get disciplines titles query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<DisciplineTitle> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update discipline title query");
                await ExecuteAsync(@"
                    update DisciplineTitle set
                        Name = @Name,
                        Shortname = @Shortname,
                        DepartmentId = @DepartmentId
                    from DisciplineTitle
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update discipline title query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}