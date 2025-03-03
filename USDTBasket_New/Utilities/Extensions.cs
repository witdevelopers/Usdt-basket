using Nancy.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Security.Claims;

namespace FXCapitalApi.Repositories
{

    public static class Extensions
    {
        public static bool HasDataTable(this DataSet ds)
        {
            if (ds != null && ds.Tables.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static bool IsDataTable(this DataTable dt)
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static string getUserId(this ClaimsPrincipal claims)
        {
            var claimsIdentity = claims.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.UserData)?.Value;
        }



        public static JToken getJsonRow(this DataTable dt, int rowIndex, List<string> exclude = null)
        {
            if (exclude != null && exclude.Count > 0)
            {
                foreach (string c in exclude)
                {
                    if (dt.Columns.Contains(c))
                        dt.Columns.Remove(c);
                }
            }

            var jArray = JArray.FromObject(dt, JsonSerializer.CreateDefault(new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                NullValueHandling = NullValueHandling.Ignore
            }));
            var rowJToken = jArray[rowIndex];
            //var rowJson = rowJToken.ToString(Formatting.Indented);
            return rowJToken;
        }

        public static JArray getJson(this DataTable dt, List<string> exclude = null)
        {
            if (exclude != null && exclude.Count > 0)
            {
                foreach (string c in exclude)
                {
                    if (dt.Columns.Contains(c))
                        dt.Columns.Remove(c);
                }
            }

            foreach (DataColumn c in dt.Columns)
                c.ColumnName = String.Join("", c.ColumnName.Split());

            var jArray = JArray.FromObject(dt, JsonSerializer.CreateDefault(new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                NullValueHandling = NullValueHandling.Ignore
            }));
            return jArray;
        }

        public static string getUserAddress(this ClaimsPrincipal claims)
        {
            var claimsIdentity = claims.Identity as ClaimsIdentity;
            return claimsIdentity.FindFirst(ClaimTypes.UserData)?.Value;
        }


        

    }

}
