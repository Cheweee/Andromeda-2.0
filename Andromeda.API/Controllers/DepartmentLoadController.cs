using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Models.Entities;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API.Controllers
{
    [Route("api/departmentLoad")]
    [ApiController]
    public class DepartmentLoadController : ControllerBase
    {
        private readonly DepartmentLoadService _service;

        public DepartmentLoadController(DepartmentLoadService service)
        {
            _service = service ?? throw new ArgumentException(nameof(service));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] DepartmentLoadGetOptions options)
        {
            return Ok(await _service.Get(options));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DepartmentLoad model)
        {
            return Ok(await _service.Create(model));
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromBody] DepartmentLoad model)
        {
            return Ok(await _service.Update(model));
        }

        [Authorize]
        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] DepartmentLoad model)
        {
            return Ok(await _service.Generate(model));
        }

        [Authorize]
        [HttpPost("import")]
        public async Task<IActionResult> Import([FromQuery]DepartmentLoadImportOptions options)
        {
            return Ok(await _service.Import(options));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] IReadOnlyList<int> ids)
        {
            await _service.Delete(ids);

            return Ok();
        }
    }
}