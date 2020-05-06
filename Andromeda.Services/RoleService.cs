using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;
using Andromeda.Shared;
using Microsoft.Extensions.Logging;

namespace Andromeda.Services
{
    public class RoleService
    {
        private readonly IRoleDao _dao;
        private readonly RoleInDepartmentService _roleInDepartmentService;
        private readonly ILogger _logger;

        public RoleService(IRoleDao dao, RoleInDepartmentService roleInDepartmentService, ILogger logger)
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _roleInDepartmentService = roleInDepartmentService ?? throw new ArgumentNullException(nameof(roleInDepartmentService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Role> Create(Role model)
        {
            await _dao.Create(model);
            
            if(model.RoleDepartments != null)
                await UpdateRoleDeparmtents(model.Id, model.RoleDepartments);
                
            return model;
        }

        public async Task<IEnumerable<Role>> Get(RoleGetOptions options)
        {
            var roles = await _dao.Get(options);
            var rolesDepartments = await _roleInDepartmentService.Get(new RoleInDepartmentGetOptions
            {
                RoleIds = roles.Select(o => o.Id).ToList()
            });

            foreach(var role in roles)
            {
                role.RoleDepartments = rolesDepartments.Where(o => o.RoleId == role.Id).ToList();
            }

            return roles;
        }

        public async Task<Role> Update(Role model)
        {
            await _dao.Update(model);
            
            if(model.RoleDepartments != null)
                await UpdateRoleDeparmtents(model.Id, model.RoleDepartments);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }

        public async Task<string> Validate(RoleGetOptions options)
        {
            try
            {
                _logger.LogInformation("Start role validating.");

                string result = ValidationUtilities.ValidateRoleName(options.Name);
                if (!string.IsNullOrEmpty(result))
                    return result;

                if (!options.Id.HasValue)
                {
                    var models = await _dao.Get(options);
                    if (models.Count() > 0)
                    {
                        string message = "Role with same user name have been already created. Please try another.";
                        _logger.LogInformation(message);
                        return message;
                    }
                }

                _logger.LogInformation("Role successfuly validated.");
                return null;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }
    
    
        public async Task UpdateRoleDeparmtents(int roleId, List<RoleInDepartment> models)
        {
            var old = await _roleInDepartmentService.Get(new RoleInDepartmentGetOptions { RoleId = roleId });

            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.RoleId = roleId);

            await _roleInDepartmentService.Delete(toDelete);
            await _roleInDepartmentService.Update(toUpdate);
            await _roleInDepartmentService.Create(toCreate);
        }
    }
}