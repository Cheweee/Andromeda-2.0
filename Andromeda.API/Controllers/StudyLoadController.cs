using System.Collections.Generic;
using System.Threading.Tasks;
using Andromeda.Data.Models;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API.Controllers
{
    public class StudyLoadController : ControllerBase
    {
        private readonly StudyLoadService _service;
        
        public StudyLoadController(StudyLoadService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]StudyLoadGetOptions options)
        {
            return Ok(await _service.Get(options));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromQuery]StudyLoad model)
        {
            return Ok(await _service.Create(model));
        }

        [Authorize]
        [HttpPatch]
        public async Task<IActionResult> Patch([FromQuery]StudyLoad model)
        {
            return Ok(await _service.Update(model));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> Delete([FromQuery]IReadOnlyList<int> ids)
        {
            await _service.Delete(ids);

            return Ok();
        }
    }
}