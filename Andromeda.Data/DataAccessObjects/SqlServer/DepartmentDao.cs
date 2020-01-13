using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Microsoft.Extensions.Logging;
using Andromeda.Shared;

namespace Andromeda.Data.DataAccessObjects.SqlServer
{
    public class DepartmentDao : BaseDao, IDepartmentDao
    {
        public DepartmentDao(DatabaseConnectionSettings settings, ILogger logger) : base(settings, logger)
        {
        }

        public async Task Create(Department model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql create department query");
                model.Id = await QuerySingleOrDefaultAsync<int>(@"
                        insert into [Department] (
                            [Name],
                            [FullName],
                            [ParentId],
                            [Type]
                        ) values (
                            @name,
                            @fullName,
                            @parentId,
                            @type
                        );
                        select SCOPE_IDENTITY();
                ", model);
                _logger.LogInformation("Sql create department query successfully executed");
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
                _logger.LogInformation("Trying to execute sql delete departments query");
                await ExecuteAsync(@"
                    delete from [Department]
                    where [Id] in @ids
                ", new { ids });
                _logger.LogInformation("Sql delete departments query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task<IEnumerable<Department>> Get(DepartmentGetOptions options)
        {
            try
            {
                StringBuilder sql = new StringBuilder();

                _logger.LogInformation("Try to create get departments sql query");

                sql.AppendLine(@"
                    with parentDepartment as (
                	select 
                		Id,
                        Name,
                        FullName
                    from Department
                	where ParentId is null
                )
                select distinct
                	d.Id,
                    d.Name,
                    d.FullName,
                    d.Type,
                    d.ParentId,
                    pd.Id,
                    pd.Name,
                    pd.FullName
                from Department d
                left join RoleInDepartment rind on rind.DepartmentId = d.Id
                left join (select * from parentDepartment) pd on pd.Id = d.ParentId
                left join RoleInDepartment rid on pd.Id = rid.DepartmentId
                left join UserRoleInDepartment urid on rid.Id = urid.RoleInDepartmentId
                ");

                int conditionIndex = 0;
                if (options.Id.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.Id = @id)");

                if (options.Type.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.Type = @Type)");

                if (options.ParentId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.ParentId = @ParentId)");

                if (options.RoleId.HasValue)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (rind.RoleID = @RoleId)");

                if (options.Ids != null && options.Ids.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.Id in @ids)");

                if(options.Names != null && options.Names.Count > 0)
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.Name in @Names)");

                if (!string.IsNullOrEmpty(options.NormalizedSearch))
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (lower(d.Name) like lower(@NormalizedSearch) or lower(d.FullName) like lower(@NormalizedSearch))");

                if (!string.IsNullOrEmpty(options.FullName))
                    sql.AppendLine($"{(conditionIndex++ == 0 ? "where" : "and")} (d.FullName = @FullName)");

                _logger.LogInformation($"Sql query successfully created:\n{sql.ToString()}");

                _logger.LogInformation("Try to execute sql get departments query");
                var result = await QueryMapAsync<Department, Department>(sql.ToString(),
                options,
                (department, parent) =>
                {
                    department.Parent = parent;
                    if (parent != null)
                        department.ParentId = parent.Id;

                    return department;
                },
                "ParentId");
                _logger.LogInformation("Sql get departments query successfully executed");
                return result;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        public async Task Update(Department model)
        {
            try
            {
                _logger.LogInformation("Trying to execute sql update department query");
                await ExecuteAsync(@"
                    update [Department] set
                        [Name] = @Name,
                        [FullName] = @FullName, 
                        [ParentId] = @ParentId, 
                        [Type] = @Type
                    where [Id] = @Id
                ", model);
                _logger.LogInformation("Sql update department query successfully executed");
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    }
}