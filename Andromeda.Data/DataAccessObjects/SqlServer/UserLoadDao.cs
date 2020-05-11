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
    public class UserLoadDao : BaseDao, IUserLoadDao
    {
        public UserLoadDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger) { }

        public async Task Create(List<UserLoad> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create user load query");
                await ExecuteAsync(@"
                        insert into UserLoad (
                            UserId,
                            StudyLoadId,
                            StudentsCount
                        ) values (
                            @UserId,
                            @StudyLoadId,
                            @StudentsCount
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create user load query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete user load query");
                await ExecuteAsync(@"
                    delete from [UserLoad]
                    where [Id] in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete user load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<UserLoad>> Get(UserLoadGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get study load sql query");

                sql.AppendLine(@"
                    select
                        ul.Id,
                        ul.UserId,
                        ul.StudyLoadId,
                        ul.StudentsCount
                    from UserLoad ul
                ");

                int conditionIndex = 0;

                if(options.StudyLoadId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ul.StudyLoadId = @StudyLoadId)");

                if(options.UserId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ul.UserId = @UserId)");

                if(options.StudyLoadsIds != null)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ul.StudyLoadId in @StudyLoadsIds)");
                    
                if(options.UsersIds != null)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (ul.UserId in @UsersIds)");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get study load query");
                var result = await QueryAsync<UserLoad>(sql.ToString(), options);
                _logger.LogInformation("Sql get study load query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(List<UserLoad> model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update user load query");
                await ExecuteAsync(@"
                    update UserLoad set
                        UserId = @UserId,
                        StudyLoadId = @StudyLoadId,
                        StudentsCount = @StudentsCount
                    from UserLoad
                    where Id = @Id
                ", model);
                _logger.LogInformation("Sql update user load query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}