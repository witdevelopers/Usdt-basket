using IpData;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FXCapitalApi
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class HttpRequestLogger
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<HttpRequestLogger> logger;
        private readonly IConfiguration configuration;
        private readonly IIPCacheManager iPCache;
        private readonly Logger requestLogger;
        private readonly string IPData_Key;
        public HttpRequestLogger(RequestDelegate next, ILogger<HttpRequestLogger> logger, IConfiguration configuration,IIPCacheManager iPCache)
        {
            _next = next;
            this.logger = logger;
            this.configuration = configuration;
            this.iPCache = iPCache;
            requestLogger = LogManager.GetLogger("httpRequestLogger");
            IPData_Key = configuration.GetValue<string>("IPData:Apikey");
        }

        public Task Invoke(HttpContext context)
        {
            try
            {
                var method = context?.Request?.Method;
                var path = context?.Request?.Path;
                var query = context?.Request?.Query.ToDictionary(q => q.Key.ToString(), q => q.Value.ToString(), StringComparer.OrdinalIgnoreCase).getFormattedString();
                var route = context?.Request.RouteValues.ToDictionary(q => q.Key.ToString(), q => q.Value.ToString(), StringComparer.OrdinalIgnoreCase).getFormattedString();
                var headers = context?.Request.Headers.ToDictionary(q => q.Key.ToString(), q => q.Value.ToString(), StringComparer.OrdinalIgnoreCase).getFormattedString();
                var ip = context?.Connection?.RemoteIpAddress?.ToString();
                string strIPInfo = "";
                if (!string.IsNullOrEmpty(ip))
                {
                    try
                    {
                        if(IPCacheManager.date.Date>DateTime.Now.Date)
                        {
                            iPCache.Dispose();
                            IPCacheManager.date = DateTime.Now;
                        }
                        if (!iPCache.IsSet(ip))
                        {
                            var client = new IpDataClient(IPData_Key);
                            var ipInfo = (client.Lookup(ip).GetAwaiter().GetResult());
                            var exclude = new string[] { "Languages", "Asn", "Currency", "EmojiFlag", "Flag", "TimeZone" };
                            strIPInfo = ipInfo.toKeyValuePair(exclude).ToDictionary(k => k.Key, v => v.Value).getFormattedString();
                            iPCache.Set<string>(ip, strIPInfo);
                        }
                        else
                        {
                            strIPInfo= iPCache.Get<string>(ip);
                        }

                    }
                    catch (Exception ex)
                    {
                        logger.LogError($"IP data threw an exception:'{ex}'");
                        strIPInfo = "";
                    }
                }
                context.Request.EnableBuffering();
                string bodyStr = "";
                if (context.Request.Body.CanRead && context.Request.Body.CanSeek)
                {
                    MemoryStream ms = new MemoryStream();
                    context?.Request?.Body.CopyTo(ms);
                    context.Request.Body.Position = 0;
                    using (StreamReader reader = new StreamReader(ms, Encoding.UTF8, true, 1024, true))
                    {

                        reader.BaseStream.Position = 0;
                        bodyStr = reader.ReadToEnd();
                        reader.BaseStream.Dispose();
                        reader.Dispose();
                    }
                }
                var dict = new Dictionary<string, object>();

                dict.Add("IP Address", ip);
                if (!string.IsNullOrEmpty(strIPInfo))
                {
                    dict.Add("IP Info", strIPInfo);
                }
                dict.Add("Method", method);
                dict.Add("Path", path);
                dict.Add("Headers", headers);
                dict.Add("Route", route);
                dict.Add("Query", query);
                dict.Add("Body", bodyStr);
                var info = dict.getFormattedString();
                requestLogger.Info(info);
            }
            catch (Exception ex)
            {
                logger.LogError($"The middleware : 'HttpRequestLogger' threw an exception:'{ex}'");
            }
            return _next(context);
        }
    }
}
