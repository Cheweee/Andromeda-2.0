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
    public class StudentGroupDao : BaseDao, IStudentGroupDao
    {
        public StudentGroupDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<StudentGroup> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create student group query");
                await ExecuteAsync(@"
                        insert into StudentGroup (
                            StudyDirectionId,
                            Name,
                            StudentsCount,
                            StartYear,
                            CurrentCourse
                        ) values (
                            @StudyDirectionId,
                            @Name,
                            @StudentsCount,
                            @StartYear,
                            @CurrentCourse
                        );
                ", model);
                _logger.LogInformation("Sql create student group query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete student groups query");
                await ExecuteAsync(@"
                    delete from StudentGroup
                    where Id in @Ids;

                    delete from [GroupDisciplineLoad]
                    where [StudentGroupId] in @Ids
                ", new { ids });
                _logger.LogInformation("Sql delete student groups query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<StudentGroup>> Get(StudentGroupGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get student groups sql query");

                sql.AppendLine(@"
                    select 
                        distinct
                        sg.Id,
                        sg.StudyDirectionId,
                        sg.Name,
                        sg.StudentsCount,
                        sg.StartYear,
                        sg.CurrentCourse
                    from StudentGroup sg                    
                ");

                if (options.DepartmentLoadsIds != null && options.DepartmentLoadsIds.Count > 0)
                    sql.AppendLine($"join GroupDisciplineLoad gdl on gdl.StudentGroupId = sg.Id and gdl.DepartmentLoadId in @DepartmentLoadsIds");

                if (options.DepartmentId.HasValue)
                    sql.AppendLine("join [StudyDirection] sd on sd.Id = sg.StudyDirectionId and sd.DepartmentId = @DepartmentId");

                if (options.DepartmentIds != null && options.DepartmentIds.Count > 0)
                    sql.AppendLine($"join [StudyDirection] sd on sd.Id = sg.StudyDirectionId and sd.DepartmentId in @DepartmentIds");

                    int conditionIndex = 0;
                if (options.Id.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} sg.Id = @id");

                if (options.Ids != null && options.Ids.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} sg.Id in @Ids");

                if (options.Names != null && options.Names.Count > 0)
                    sql.AppendLine($@"{(conditionIndex++ == 0 ? "where" : "and")} sg.Name in @Names");

                if (!string.IsNullOrEmpty(options.Search))
                    sql.AppendLine($@"{(conditionIndex++ == 0 ? "where" : "and")} lower(sg.Name) like '%lower(@search)%'");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get student groups query");
                var result = await QueryAsync<StudentGroup>(sql.ToString(), options);
                _logger.LogInformation("Sql get student groups query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<StudentGroup> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update student group query");
                await ExecuteAsync(@"
                    update StudentGroup set
                        StudyDirectionId = @StudyDirectionId, 
                        Name = @Name,
                        StudentsCount = @StudentsCount, 
                        StartYear = @StartYear, 
                        CurrentCourse = @CurrentCourse
                    from StudentGroup
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update student group query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}