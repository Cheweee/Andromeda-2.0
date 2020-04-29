using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API
{
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _service;

        public RoleController(RoleService service)
        {
            _service = service ?? throw new ArgumentNullException(nameof(service));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]RoleGetOptions options)
        {
            return Ok(await _service.Get(options));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Role model)
        {
            string message = await _service.Validate(
                new RoleGetOptions
                {
                    Name = model.Name,
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
        public async Task<IActionResult> Patch([FromBody]Role model)
        {
            string message = await _service.Validate(
                new RoleGetOptions
                {
                    Id = model.Id,
                    Name = model.Name,
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