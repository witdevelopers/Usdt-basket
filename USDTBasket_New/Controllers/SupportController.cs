using Api.Repositories.Interfaces;
using FXCapitalApi.Authentication;
using FXCapitalApi.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportController : ControllerBase
    {

        private readonly IJWTAuthentication jWTAuthentication;
        private readonly ISupportRepository support;

        public SupportController(IJWTAuthentication jWTAuthentication, ISupportRepository support)
        {
            this.jWTAuthentication = jWTAuthentication;
            this.support = support;

        }

        [HttpPost("InsertCompanyMessage")]
        public IActionResult InsertCompanyMessage(string FromUserId, string ToUserId_s, bool IsToAdmin, string Subject, string Message)
        {
            DataSet ds = support.InsertCompanyMessage(FromUserId, ToUserId_s, IsToAdmin, Subject, Message);

           return new JsonResult(new { status = true, message = "Message Inserted", data = ds });
        }

        [HttpGet("GetCompanyMessage")]
        public IActionResult GetCompanyMessage(string UserId, bool IsAdmin, bool IsInbox)
        {
            DataSet ds = support.GetCompanyMessage(UserId, IsAdmin, IsInbox);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, message = "OK!", data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No Data Found!", data = new { } });

        }

        [HttpDelete("DeleteCompanyMessage")]
        public IActionResult DeleteCompanyMessage(string MessageId_s, bool IsInbox)
        {
            DataSet ds = support.DeleteCompanyMessage( MessageId_s, IsInbox);

            return new JsonResult(new { status = true, message = "Message Deleted", data = ds });
        }

    }
}
