using FXCapitalApi.Repositories;
using Google.Type;
using GowinzoApi.DataAccess;
using GowinzoApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace GowinzoApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class WalletController : ControllerBase
    {
        private readonly IUserWalletRepository wallet;
        private readonly IWithdrawalRepository withdrawalRepository;

        public WalletController(IUserWalletRepository wallet,IWithdrawalRepository withdrawalRepository)
        {
            this.wallet = wallet;
            this.withdrawalRepository = withdrawalRepository;
        }

        //[HttpPost("request/")]
        //public IActionResult FundRequest(FundRequestPayload req)
        //{
        //    string userId = User.getUserId();

        //    req.userId = userId;
        //    var resp = wallet.AddFundRequest(req);
        //    bool status = resp.IsDataTable() && Convert.ToBoolean(resp.Rows[0]["Success"]);
        //    string message = resp.Rows[0]["Message"].ToString();
        //    return new{}.getString(status, message).getContentResult();
        //}

        [HttpGet("getWallets")]
        public IActionResult getWallets(string FromPage, int TransferFromWalletId)
        {
            string userId = User.getUserId();
            DataSet ds = wallet.getWallets(FromPage, TransferFromWalletId);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, message = "Ok!", data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("getBalance_MLM")]
        public IActionResult getBalance(int walletId,string userId)
        {
            //string userId = User.getUserId();
           var rs= wallet.getBalance(userId, walletId);
            return new JsonResult(rs);
        }
        [HttpGet("getBalance-Crypto")]
        public IActionResult getBalance(int walletId)
        {
            string userId = User.getUserId();
            var rs = wallet.getBalance(userId, walletId);
            return new JsonResult(rs);
        }

    [HttpGet("passbook-mlm")]
    public IActionResult getpassbookdetails(string userId, int WalletType, string Fromdate, string Todate, bool IsMiniStatement, string SearchTransaction)
    {

      DataSet ds = wallet.getpassbookdetails(userId, WalletType, Fromdate, Todate, IsMiniStatement, SearchTransaction);

      // Check if the DataSet has tables
      // Check if the DataSet has tables

      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, message = "Ok!", data = ds });
        return res;
      }

      return new JsonResult(new { status = false, message = "No data found!", data = new { } });

    }


    [HttpPost("CreditDebitAmountWallet")]
        public IActionResult CreditDebitAmountWallet(string userId, int WalletType, string type, int amount, string remarks, int byAdminId)
        {

            DataSet ds = wallet.CreditDebitAmountWallet(userId, WalletType, type, amount, remarks, byAdminId);

            // Check if the DataSet has tables
            // Check if the DataSet has tables

return new JsonResult(new { status = true, message = "Ok !", data = new { } });

        }

        [HttpGet("getRechargeHistory")]
        public IActionResult getRechargeHistory()
        {
            string userId = User.getUserId();
            var rs = wallet.getRechargeDetails(userId, "", "");
            return new JsonResult(rs.Tables[0].getJson());
        }

        //[HttpPost("addWithdrawalRequest/")]
        //public IActionResult addWithdrawalRequest(WithdrawalModel withdrawal)
        //{
        //    string userId = User.getUserId();
        //    withdrawal.UserId = userId;
        //   var rs= withdrawalRepository.addWithdrawalRequest(withdrawal);
        //    if(rs.IsDataTable())
        //    {
        //        bool status = Convert.ToBoolean(rs.Rows[0]["Success"]);
        //        string message = rs.Rows[0]["Message"].ToString();
        //        return new JsonResult(new {status,message });
        //    }
        //    else
        //    {
        //        return new JsonResult(new { status=false, message="some error occurred." });
        //    }
        //}

        [HttpGet("getWithdrawalRequests/")]
        public IActionResult getWithdrawalRequests()
        {
            string userId = User.getUserId();
            var rs = withdrawalRepository.getWithdrawalRequests(userId);
            return new JsonResult(rs);
        }

        [HttpGet("passbook/")]
        public IActionResult passbook([FromQuery]string pageNo="1",[FromQuery] string pageSize="10")
        {
            var payload = new PassbookPayload
            {
                userId = User.getUserId(),
                pageSize=pageSize,
                pageNo=pageNo
            };
            var rs = withdrawalRepository.getPassbook(payload);
            return new JsonResult(new { data=rs.Tables[0].getJson(),total=rs.Tables[1].Rows[0][0] });
        }

    }
}
