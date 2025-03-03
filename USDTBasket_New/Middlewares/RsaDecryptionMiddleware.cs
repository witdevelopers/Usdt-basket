using Api.Services;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Api.Middlewares
{
    public class RsaDecryptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IRsaKeyService _rsaKeyService;

        public RsaDecryptionMiddleware(RequestDelegate next, IRsaKeyService rsaKeyService)
        {
            _next = next;
            _rsaKeyService = rsaKeyService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Check if the request contains the private key in headers
            if (context.Request.Headers.TryGetValue("PrivateKey", out var providedKey))
            {
                var storedKey = _rsaKeyService.GetPrivateKey();
                if (providedKey == storedKey)
                {
                    // If the private key is valid, proceed to the next middleware/controller
                    await _next(context);
                    return;
                }
                else
                {
                    // Return unauthorized status if the key is invalid
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Unauthorized: Invalid private key.");
                    return;
                }
            }

            // Return unauthorized status if no key is provided
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized: Private key required.");
        }
    }
}
