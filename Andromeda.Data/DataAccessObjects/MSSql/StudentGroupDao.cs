using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.MSSql
{
    public class StudentGroupDao : BaseDao, IStudentGroupDao
    {
        public StudentGroupDao(string connectionString, ILogger logger) : base(connectionString, logger) { }

        public async Task Create(StudentGroup model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create student group query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into User (
                            StudyDirection,
                            Name,
                            StudentsCount,
                            StartYear,
                            CurrentCourse,
                            DepartmentId,
                            StudyLoadId
                        ) values (
                            @StudyDirection,
                            @Name,
                            @StudentsCount,
                            @StartYear,
                            @CurrentCourse,
                            @DepartmentId,
                            @StudyLoadId
                        );
                        select SCOPE_IDENTITY();
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
                    where Id = any(@ids)
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
                        Id,
                        StudyDirection,
                        Name,
                        StudentsCount,
                        StartYear,
                        CurrentCourse,
                        DepartmentId,
                        StudyLoadId
                    from StudentGroup");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} Id = @id");
                }
                if (options.Ids != null)
                {
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} id = any(@ids)");
                }
                if (options.Search != null)
                {
                    sql.AppendLine($@"
                        {(conditionIndex++ == 0 ? "where" : "and")} lower(StudyDirection) like '%lower(@search)%'
                        or lower(Name) like '%lower(@search)%'
                    ");
                }
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

        public async Task Update(StudentGroup model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update student group query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                    update set
                        StudyDirection = @StudyDirection, 
                        Name = @Name,
                        StudentsCount = @StudentsCount, 
                        StartYear = @StartYear, 
                        CurrentCourse = @CurrentCourse, 
                        DepartmentId = @DepartmentId,
                        StudyLoadId = @StudyLoadId
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