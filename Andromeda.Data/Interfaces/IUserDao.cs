using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;

namespace Andromeda.Data.Interfaces
{
    public interface IUserDao
    {        
        Task<IEnumerable<User>> Get(UserGetOptions options);
        Task<IEnumerable<AuthenticatedUser>> Get(UserAuthorizeOptions options);
        Task Create(User model);
        Task Update(User model);
        Task Delete(IReadOnlyList<int> ids);
    }
}