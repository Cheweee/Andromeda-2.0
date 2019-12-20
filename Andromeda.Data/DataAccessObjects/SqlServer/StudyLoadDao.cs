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
    public class StudyLoadDao : BaseDao, IStudyLoadDao
    {
        public StudyLoadDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger)
        {
        }

        public async Task Create(List<StudyLoad> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create study load query");
                await ExecuteAsync(@"
                        insert into StudyLoad (
                            Id,
                            FacultyId,
                            DepartmentId,
                            DisciplineTitleId,
                            SemesterNumber,
                            StudyWeeksCount,
                            GroupsInTheStream,
                            Value,
                            UserId,
                            ProjectType
                        ) values (
                            @Id,
                            @FacultyId,
                            @DepartmentId,
                            @DisciplineTitleId,
                            @SemesterNumber,
                            @StudyWeeksCount,
                            @GroupsInTheStream,
                            @Value,
                            @UserId,
                            @ProjectType                           
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create study load query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete study load query");
                await ExecuteAsync(@"
                    delete from StudyLoad
                    where Id = any(@ids)
                ", new { ids });
                _logger.LogInformation("Sql delete study load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<StudyLoad>> Get(StudyLoadGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get study load sql query");

                sql.AppendLine(@"
                    select
                        sl.Id,
                        sl.FacultyId,
                        sl.DepartmentId,
                        sl.DisciplineTitleId,
                        sl.SemesterNumber,
                        sl.StudyWeeksCount,
                        sl.GroupsInTheStream,
                        sl.Value,
                        sl.UserId,
                        sl.ProjectType
                    from StudyLoad sl
                    left join User u on u.Id = sl.UserId
                    left join Department d on d.Id = sl.FacultyId
                    left join DisciplineTitle dt on dt.Id = sl.DisciplineTitleId
                ");

                int conditionIndex = 0;
                if (options.DepartmentLoadId.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (sl.DepartmentLoadId = @DepartmentLoadId)");
                }
                if (options.OnlyDistributed.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (sl.UserId is not null)");
                }
                if (options.OnlyNotDistibuted.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (sl.UserId is null)");
                }
                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get study load query");
                var result = await QueryAsync<StudyLoad>(sql.ToString(), options);
                _logger.LogInformation("Sql get study load query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<StudyLoad> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update study load query");
                await ExecuteAsync(@"
                    update set
                        Id = @Id,
                        FacultyId = @FacultyId,
                        DepartmentId = @DepartmentId,
                        DisciplineTitleId = @DisciplineTitleId,
                        SemesterNumber = @SemesterNumber,
                        StudyWeeksCount = @StudyWeeksCount,
                        GroupsInTheStream = @GroupsInTheStream,
                        Value = @Value,
                        UserId = @UserId,
                        ProjectType = @ProjectType
                    from StudyLoad
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update study load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}