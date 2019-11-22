using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Microsoft.Extensions.Logging;

namespace Andromeda.Data.DataAccessObjects.MSSql
{
    public class StudyLoadDao : BaseDao, IStudyLoadDao
    {
        public StudyLoadDao(string connectionString, ILogger logger) : base(connectionString, logger)
        {
        }

        public async Task Create(StudyLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create study load query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into StudyLoad (
                            FacultyId,
                            SubjectName,
                            SemesterNumber,
                            StudyWeeksCount,
                            Lections,
                            PracticalWorks,
                            LaboratoryWorks,
                            TemathicalDiscussions,
                            Consultations,
                            Exams,
                            Offests,
                            ControlWorks,
                            Abstrats,
                            ESControlWorks,
                            StateExams,
                            PSEntryExams,
                            Practices,
                            DepartmentManagement,
                            ResearchWorks,
                            CourseWorks,
                            GraduationWorkManagement,
                            MasterProgramManagement,
                            UndergraduateProgramManagement
                        ) values (
                            @FacultyId,
                            @SubjectName,
                            @SemesterNumber,
                            @StudyWeeksCount,
                            @Lections,
                            @PracticalWorks,
                            @LaboratoryWorks,
                            @TemathicalDiscussions,
                            @Consultations,
                            @Exams,
                            @Offests,
                            @ControlWorks,
                            @Abstrats,
                            @ESControlWorks,
                            @StateExams,
                            @PSEntryExams,
                            @Practices,
                            @DepartmentManagement,
                            @ResearchWorks,
                            @CourseWorks,
                            @GraduationWorkManagement,
                            @MasterProgramManagement,
                            @UndergraduateProgramManagement                            
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
                        Id,
                        FacultyId,
                        d.Name as FacultyName,
                        SubjectName,
                        SemesterNumber,
                        StudyWeeksCount,
                        Lections,
                        PracticalWorks,
                        LaboratoryWorks,
                        TemathicalDiscussions,
                        Consultations,
                        Exams,
                        Offests,
                        ControlWorks,
                        Abstrats,
                        ESControlWorks,
                        StateExams,
                        PSEntryExams,
                        Practices,
                        DepartmentManagement,
                        ResearchWorks,
                        CourseWorks,
                        GraduationWorkManagement,
                        MasterProgramManagement,
                        UndergraduateProgramManagement
                    from StudyLoad
                    join Department d on d.Id = FacultyId
                    where d.Type = 1");

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
                        {(conditionIndex++ == 0 ? "where" : "and")} lower(SubjectName) like '%lower(@search)%'
                    ");
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

        public async Task Update(StudyLoad model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update study load query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                    update set
                        FacultyId = @FacultyId,
                        SubjectName = @SubjectName
                        SemesterNumber = @SemesterNumber
                        StudyWeeksCount = @StudyWeeksCount
                        Lections = @Lections
                        PracticalWorks = @PracticalWorks
                        LaboratoryWorks = @LaboratoryWorks
                        TemathicalDiscussions = @TemathicalDiscussions
                        Consultations = @Consultations
                        Exams = @Exams
                        Offests = @Offests
                        ControlWorks = @ControlWorks
                        Abstrats = @Abstrats
                        ESControlWorks = @ESControlWorks
                        StateExams = @StateExams
                        PSEntryExams = @PSEntryExams
                        Practices = @Practices
                        DepartmentManagement = @DepartmentManagement
                        ResearchWorks = @ResearchWorks
                        CourseWorks = @CourseWorks
                        GraduationWorkManagement = @GraduationWorkManagement
                        MasterProgramManagement = @MasterProgramManagement
                        UndergraduateProgramManagement = @UndergraduateProgramManagement
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