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
    public class GroupDisciplineLoadDao : BaseDao, IGroupDisciplineLoadDao
    {
        public GroupDisciplineLoadDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(GroupDisciplineLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create group discipline load query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into GroupDisciplineLoad (
                            DepartmentLoadId,
                            DisciplineTitleId,
                            StudentGroupId,
                            FacultyId,
                            SemesterNumber,
                            StudyWeeksCount,
                            Amount
                        ) values (
                            @DepartmentLoadId,
                            @DisciplineTitleId,
                            @StudentGroupId,
                            @FacultyId,
                            @SemesterNumber,
                            @StudyWeeksCount,
                            @Amount
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create group discipline load query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete group discipline load query");
                await ExecuteAsync(@"
                    delete from GroupDisciplineLoad
                    where Id = any(@ids)
                ", new { ids });
                _logger.LogInformation("Sql delete group discipline load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<GroupDisciplineLoad>> Get(GroupDisciplineLoadGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get group discipline load sql query");

                sql.AppendLine(@"
                    select
                        gl.Id,
                        gl.DepartmentLoadId,
                        gl.DisciplineTitleId,
                        gl.StudentGroupId,
                        gl.FacultyId,
                        gl.SemesterNumber,
                        gl.StudyWeeksCount,
                        gl.Amount
                    from GroupDisciplineLoad gl
                    left join DepartmentLoad dl on gl.DepartmentLoadId = dl.Id
                ");

                int conditionIndex = 0;
                
                if (options.DepartmentLoadId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (dl.Id = @DepartmentLoadId)");

                if (options.DepartmentLoadsIds != null && options.DepartmentLoadsIds.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (dl.Id in @DepartmentLoadsIds)");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get group discipline load query");
                var result = await QueryAsync<GroupDisciplineLoad>(sql.ToString(), options);
                _logger.LogInformation("Sql get group discipline load query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(GroupDisciplineLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update group discipline load query");
                await ExecuteAsync(@"
                    update set
                        DepartmentLoadId = @DepartmentLoadId,
                        DisciplineTitleId = @DisciplineTitleId,
                        StudentGroupId = @StudentGroupId,
                        FacultyId = @FacultyId,
                        SemesterNumber = @SemesterNumber,
                        StudyWeeksCount = @StudyWeeksCount,
                        Amount = @Amount
                    from GroupDisciplineLoad
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update group discipline load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}