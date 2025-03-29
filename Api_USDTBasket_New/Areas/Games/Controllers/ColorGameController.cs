using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Areas.Games.Controllers
{
    [Authorize]
    [Area("Games")]
    [Route("Games/[controller]")]
    [ApiController]
    public class ColorGameController : ControllerBase
    {

        [HttpGet("Get")]
        public IActionResult Get()
        {
            return Ok("Color Game");
        }
    }
}
