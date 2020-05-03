using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Interfaces;
using Andromeda.Models.Entities;

namespace Andromeda.Services
{
    public class UserLoadService
    {
        private readonly IUserLoadDao _dao;

        private readonly UserService _userService;

        public UserLoadService(
                IUserLoadDao dao,
                UserService userService
            )
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        public async Task<IEnumerable<UserLoad>> Get(UserLoadGetOptions options)
        {
            var userLoad = await _dao.Get(options);

            var users = await _userService.Get(new UserGetOptions
            {
                Ids = userLoad.Select(o => o.UserId).ToList()
            });

            foreach (var load in userLoad)
            {
                load.User = users.FirstOrDefault(o => o.Id == load.UserId);
            }

            return userLoad;
        }

        public async Task<List<UserLoad>> Create(List<UserLoad> models)
        {
            await _dao.Create(models);
            return models;
        }

        public async Task<List<UserLoad>> Update(List<UserLoad> models)
        {
            await _dao.Update(models);
            return models;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }
    }
}