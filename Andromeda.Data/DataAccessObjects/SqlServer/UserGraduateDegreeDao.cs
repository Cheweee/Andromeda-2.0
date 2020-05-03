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
    public class UserGraduateDegreeDao : BaseDao, IUserGraduateDegreeDao
    {
        public UserGraduateDegreeDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<UserGraduateDegree> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create user graduate degree query");
                await ExecuteAsync(@"
                        insert into UserGraduateDegree (
                            UserId,
                            GraduateDegree,
                            BranchOfScience
                        ) values (
                            @UserId,
                            @GraduateDegree,
                            @BranchOfScience
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create user graduate degree query successfully executed");
            }
            catch(Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;                
            }
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql delete user graduate degree query");
                await ExecuteAsync(@"
                    delete from UserGraduateDegree
                    where Id = any(@ids)
                ", new { ids });
                _logger.LogInformation("Sql delete user graduate degree query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<UserGraduateDegree>> Get(UserGraduateDegreeGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get study load sql query");

                sql.AppendLine(@"
                    select ul.Id
                        , UserId
                        , GraduateDegree
                        , BranchOfScience
                    from UserGraduateDegree ugd
                ");

                int conditionIndex = 0;

                if(options.UserId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ugd.UserId = @UserId)");

                if(options.UsersIds != null)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ugd.UserId in @UsersIds)");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get study graduate degree query");
                var result = await QueryAsync<UserGraduateDegree>(sql.ToString(), options);
                _logger.LogInformation("Sql get user graduate degree query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<UserGraduateDegree> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update user graduate degree query");
                await ExecuteAsync(@"
                    update UserGraduateDegree set
                        UserId = @UserId,
                        GraduateDegree = @GraduateDegree,
                        BranchOfScience = @BranchOfScience
                    from UserGraduateDegree
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update user graduate degree query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}