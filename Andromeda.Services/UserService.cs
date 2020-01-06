using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Andromeda.Data.Interfaces;
using Andromeda.Data.Models;
using Andromeda.Shared;
using Microsoft.IdentityModel.Tokens;

namespace Andromeda.Services
{
    public class UserService
    {
        private readonly IUserDao _dao;
        private readonly PinnedDisciplineService _pinnedDisciplineService;
        private readonly Appsettings _settings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger _logger;

        public UserService(
            IUserDao dao,
            PinnedDisciplineService pinnedDisciplineService,
            Appsettings settings,
            IHttpContextAccessor httpContextAccessor,
            ILogger logger
        )
        {
            _dao = dao ?? throw new ArgumentNullException(nameof(dao));
            _pinnedDisciplineService = pinnedDisciplineService ?? throw new ArgumentException(nameof(pinnedDisciplineService));
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
            _httpContextAccessor = httpContextAccessor ?? throw new ArgumentNullException(nameof(httpContextAccessor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<User> Create(User model)
        {
            await _dao.Create(model);
            model.Password = null;

            if (model.PinnedDisciplines != null)
            {
                await UpdateUserPinnedDisciplines(model.Id, model.PinnedDisciplines);
            }

            return model;
        }

        public async Task<IEnumerable<User>> Get(UserGetOptions options)
        {
            var users = await _dao.Get(options);
            var usersIds = users.Select(o => o.Id).ToList();
            var usersPinnedDisciplines = await _pinnedDisciplineService.Get(new PinnedDisciplineGetOptions { UsersIds = usersIds });

            foreach (var user in users)
            {
                user.PinnedDisciplines = usersPinnedDisciplines.Where(o => o.UserId == user.Id).ToList();
            }

            return users;
        }

        public async Task<AuthenticatedUser> SignIn(UserAuthorizeOptions options)
        {
            var users = await _dao.Get(options);
            var user = users.FirstOrDefault();
            if (user == null)
            {
                return null;
            }

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_settings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);

            if (options.RememberMe)
            {
                if (_httpContextAccessor.HttpContext.Request.Cookies.ContainsKey("andromeda-token"))
                {
                    _httpContextAccessor.HttpContext.Response.Cookies.Delete("andromeda-token");
                }
                _httpContextAccessor.HttpContext.Response.Cookies.Append("andromeda-token", user.Token);
            }

            user.Password = null;

            return user;
        }

        public async Task<User> Update(User model)
        {
            await _dao.Update(model);

            if (model.PinnedDisciplines != null)
                await UpdateUserPinnedDisciplines(model.Id, model.PinnedDisciplines);

            return model;
        }

        public async Task Delete(IReadOnlyList<int> ids)
        {
            await _dao.Delete(ids);
        }

        public async Task<string> ValidateUser(UserGetOptions options)
        {
            try
            {
                _logger.LogInformation("Start user name and email validating.");

                string result = ValidationUtilities.ValidateUserName(options.Username);
                if (!string.IsNullOrEmpty(result))
                    return result;

                result = ValidationUtilities.ValidateEmail(options.Email);
                if (!string.IsNullOrEmpty(result))
                    return result;

                var users = await _dao.Get(options);
                if (users.Where(o => o.Username != options.Username).Count() > 0)
                {
                    string message = "User with same user name or email have been already created. Please try another or try to sign in.";
                    _logger.LogInformation(message);
                    return message;
                }

                _logger.LogInformation("User name and email successfuly validated.");
                return null;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
                throw exception;
            }
        }

        private async Task UpdateUserPinnedDisciplines(int userId, List<PinnedDiscipline> models)
        {
            var old = await _pinnedDisciplineService.Get(new PinnedDisciplineGetOptions
            {
                UserId = userId
            });
            var toDelete = old.Select(o => o.Id).Where(o => !models.Select(du => du.Id).Contains(o)).ToList();
            var toUpdate = old.Where(o => models.Select(du => du.Id).Contains(o.Id)).ToList();
            var toCreate = models.Where(o => !old.Select(du => du.Id).Contains(o.Id)).ToList();

            toCreate.ForEach(o => o.UserId = userId);

            await _pinnedDisciplineService.Delete(toDelete);
            await _pinnedDisciplineService.Update(toUpdate);
            await _pinnedDisciplineService.Create(toCreate);
        }
    }
}