using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<IActionResult> Signin([FromBody]UserAuthorizeOptions options)
        {
            return Ok(await _service.SignIn(options));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]UserGetOptions options)
        {
            return Ok(await _service.Get(options));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]User model)
        {
            string message = await _service.ValidateUser(
                new UserGetOptions
                {
                    Username = model.Username,
                    Email = model.Email
                }
            );
            if (!string.IsNullOrEmpty(message))
            {
                return BadRequest(new { message });
            }

            return Ok(await _service.Create(model));
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody]User model)
        {
            string message = await _service.ValidateUser(
                new UserGetOptions
                {
                    Username = model.Username,
                    Email = model.Email
                }
            );
            if (!string.IsNullOrEmpty(message))
            {
                return BadRequest(new { message });
            }
            return Ok(await _service.Update(model));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody]IReadOnlyList<int> ids)
        {
            await _service.Delete(ids);

            return Ok();
        }
    }
}