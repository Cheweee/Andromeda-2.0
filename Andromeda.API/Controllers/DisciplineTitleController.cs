using System;
using System.Threading.Tasks;
using Andromeda.Models.Entities;
using Andromeda.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andromeda.API.Controllers
{
    [Route("api/disciplinetitle")]
    [ApiController]
    public class DisciplineTitleController : ControllerBase
    {
        private readonly DisciplineTitleService _disciplineService;

        public DisciplineTitleController(DisciplineTitleService disciplineTitleService)
        {
            _disciplineService = disciplineTitleService ?? throw new ArgumentException(nameof(disciplineTitleService));
        }

        [HttpGet("notpinned")]
        [Authorize]
        public async Task<IActionResult> Get([FromQuery]DisciplineTitleGetOptions options)
        {
            var models = await _disciplineService.GetNotPinnedDisciplines(options);

            return Ok(models);
        }
    }
}