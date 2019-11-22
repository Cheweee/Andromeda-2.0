using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API.Controllers
{
    [Route("api/department")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentService _service;

        public DepartmentController(DepartmentService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]DepartmentGetOptions options)
        {
            return Ok(await _service.Get(options));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Department model)
        {
            string message = await _service.Validate(new DepartmentGetOptions { FullName = model.FullName });
            if (!string.IsNullOrEmpty(message))
            {
                return BadRequest(new { message });
            }
            return Ok(await _service.Create(model));
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody]Department model)
        {
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