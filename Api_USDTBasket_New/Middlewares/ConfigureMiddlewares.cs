using Microsoft.AspNetCore.Builder;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FXCapitalApi
{
    public static class ConfigureMiddlewares
    {
        public static IApplicationBuilder UseHttpRequestLogger(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpRequestLogger>();
        }

        public static IApplicationBuilder UseSecurityHeaderFilter(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<HttpRequestLogger>();
        }
    }
}
