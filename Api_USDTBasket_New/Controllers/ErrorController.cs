using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace FXCapitalApi.Controlller
{
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : ControllerBase
    {
         private readonly ILogger<ErrorController> logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            this.logger = logger;
        }

        [AllowAnonymous]
        [Route("/Error/{statusCode}")]
        public IActionResult HttpStatusCodeHandler(int statusCode)
        {
            var statusCodeResult = HttpContext.Features.Get<IStatusCodeReExecuteFeature>();
            switch (statusCode)
            {
                case 404:
                    logger.LogWarning($"404 error occurred. Path='{statusCodeResult.OriginalPath}' and QueryString='{statusCodeResult.OriginalQueryString}'");
                    return NotFound("The resource you are looking for could not be found");
            }

            return StatusCode(500);

        }

        [Route("Error")]
        [AllowAnonymous]
        public IActionResult Error()
        {
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            logger.LogError($"The path :'{exceptionHandlerPathFeature.Path} 'threw an exception:'{exceptionHandlerPathFeature.Error}'");

            return StatusCode(500);
        }
    }
}
