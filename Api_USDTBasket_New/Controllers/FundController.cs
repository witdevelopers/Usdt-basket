using FXCapitalApi.Models;
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;
using TronNet.Protocol;


namespace FXCapitalApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FundController : Controller
    {
        private readonly IFundRepository fundRepository;
        private readonly IUtils utils;
        private readonly ITransaction transaction;

        public FundController(IFundRepository fundRepository, IUtils utils, ITransaction transaction)
        {
            this.fundRepository = fundRepository;
            this.utils = utils;
            this.transaction = transaction;
        }

        [HttpPost("Invest")]
        public IActionResult Invest(InvestmentPayload payload)
        {
             TransactionValidity transactionValidity = transaction.IsTransactionValid_NativeETHTokens(payload.transactionHash, payload.Amount);

            if (transactionValidity.isValid)
            {
                DataSet ds = fundRepository.INSERT_INTO_tblPool_G_user(payload, transactionValidity.fromAddress);

                //if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                //{
                //    DataRow dr = ds.Tables[0].Rows[0];
                    return new JsonResult(new { message = "Successfully deposited!", data = new { } });
                //}
                //return new JsonResult(new { status = false, message = "Some error occurred while depositing!", data = new { } });
            }
            return new JsonResult(new { status = false, message = "Invalid transaction!", data = new { } });
        }

        [HttpGet("SellTokens")]
        public IActionResult SellTokens(decimal tokenAmount)
        {
            string userAddress = User.getUserId();
            DataSet ds = fundRepository.SellTokens(userAddress, tokenAmount);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]) && Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]) > 0)
                {
                    int requestId = Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]);
                    decimal amountWithdrawn = Convert.ToDecimal(ds.Tables[0].Rows[0]["AmountSentToWallet"]);
                    decimal adminAmount = Convert.ToDecimal(ds.Tables[0].Rows[0]["AdminAmount"]);

                    try
                    {
                        string hash = transaction.SendETHWithdrawal(userAddress, new decimal[] { amountWithdrawn, adminAmount });

                        Thread.Sleep(5000);

                        if (hash != null && hash != "")
                        {
                            while (true)
                            {
                                if (transaction.IsETHTransactionSuccess(hash) == 1)
                                {
                                    DataSet approveDs = fundRepository.ApproveRejectTokenSellRequest(requestId, hash, 1);
                                    return new JsonResult(new { status = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]), message = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]) ? "Token sold successfully!" : approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                }
                                else if (transaction.IsETHTransactionSuccess(hash) == 2)
                                {
                                    DataSet approveDs = fundRepository.ApproveRejectTokenSellRequest(requestId, hash, 2);
                                    return new JsonResult(new { status = false, message = approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                }
                                Thread.Sleep(1000);
                            }
                        }
                        else
                        {
                            fundRepository.ApproveRejectTokenSellRequest(requestId, "Some error occurred while broadcasting transaction!", 2);
                            return new JsonResult(new { status = false, message = "Some error occurred while broadcasting transaction!" + hash, data = new { } });
                        }
                    }
                    catch (Exception ex)
                    {
                        fundRepository.ApproveRejectTokenSellRequest(requestId, ex.Message, 2);
                        return new JsonResult(new { status = false, message = "Inner: " + ex.Message, data = new { } });
                    }
                }
                return new JsonResult(new { status = false, message = ds.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
            }
            return new JsonResult(new { status = false, message = "Some error occurred while placing sell order!", data = new { } });
        }

        //[HttpPost("Withdraw")]
        //public IActionResult PlaceWithdrawalMlm(string userId, int WalletId, decimal amount, string signature)
        //{
        //    try
        //    {
        //        // Call the repository method to execute the stored procedure and get the result
        //        DataSet ds = fundRepository.PlaceWithdrawalOrder_Mlm(userId, WalletId, amount, signature);

        //        // Check if the dataset contains data (result of the insert operation)
        //        if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
        //        {
        //            var result = new JsonResult(new { status = true, message = "Withdrawal request placed successfully!", data = ds });
        //            return result;
        //        }

        //        // Return failure response if no data was returned or the insert operation failed
        //        return new JsonResult(new { status = false, message = "Failed to place withdrawal request!", data = new { } });
        //    }
        //    catch (Exception ex)
        //    {
        //        // Handle exceptions, return error response
        //        return new JsonResult(new { status = false, message = "An error occurred: " + ex.Message, data = new { } });
        //    }
        //}

        [HttpGet("RequestForInvestment")]
        public IActionResult RequestForInvestment(string userID, decimal amount, string ModeOfPayment, string ReferenceNo, string Remarks)
        {

            DataSet ds = fundRepository.RequestForInvestment(userID, amount, ModeOfPayment, ReferenceNo, Remarks);


            return new JsonResult(new { status = true,  data = ds });
        }

    [HttpGet("InsertHashKey")]
    public IActionResult InsertHashKey(string HashKey, string FromAddress, string ToAddress, string adminAddress, decimal toadminAmount, decimal totalAmount, string contractAddress)
    {
      DataSet ds = fundRepository.InsertHashKey(HashKey, FromAddress, ToAddress, adminAddress, toadminAmount, totalAmount, contractAddress);
      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, data = ds });
        return res;
      }

      return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
    }

    [HttpGet("GetRequestForInvestment")]
        public IActionResult GetRequestForInvestment(string UserId)
        {

            DataSet ds = fundRepository.GetRequestForInvestment(UserId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true,  data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

    [HttpGet("CheckSponsorIncome")]
    public IActionResult CheckSponsorIncome(string UserId)
    {

      DataSet ds = fundRepository.CheckSponsorIncome(UserId);
      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, data = ds });
        return res;
      }

      return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
    }


    //For Mlm
    [HttpGet("GetWithdraw-MLM")]
        public IActionResult GetWithdrawMlm(string UserId, string Fromdate, string Todate, int? Status)
        {
            
            DataSet ds = fundRepository.GetWithdrawalOrder_Mlm(UserId, Fromdate, Todate, Status);



            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true,  data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }


        [HttpGet("GetRequestsForWithdrawal-Crypto")]
        public IActionResult GetRequestsForWithdrawal(string UserId, string Fromdate, string Todate, int? Status)
        {

            DataSet ds = fundRepository.GetRequestsForWithdrawal(UserId, Fromdate, Todate, Status);



            return new JsonResult(new { status = true, message = "Ok!", data = ds });
        }

        [HttpPost("Withdraw_MLM")]
        public IActionResult PlaceWithdrawal_Mlm(string userId, int WalletId, decimal amount, string remarks)
        {
          
                DataSet ds = fundRepository.PlaceWithdrawalOrder_Mlm(userId, WalletId, amount, remarks);


            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true,  data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });

        }

        //For Crypto
        [HttpGet("Withdraw_crypto")]
        public IActionResult WithdrawCrypto(int WalletId, decimal amount)
        {
            try
            {
                //string message = " Do you want to withdraw " + payload.amount.ToString() + " MATIC?";
                //bool isValid = utils.VerifyETHSignature(message, payload.userAddress, payload.signature);

                //if (isValid)
                //{
                string userAddress = User.getUserId();
             
                DataSet ds = fundRepository.PlaceWithdrawalOrder( userAddress, WalletId, amount, "");
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                {
                    if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]) && Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]) > 0)
                    {
                        int requestId = Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]);
                        decimal amountWithdrawn = Convert.ToDecimal(ds.Tables[0].Rows[0]["AmountWithdrawn"]);
                        decimal adminAmount = Convert.ToDecimal(ds.Tables[0].Rows[0]["AdminAmount"]);

                        try
                        {
                            string hash = transaction.SendETHWithdrawal(userAddress, new decimal[] { amountWithdrawn, adminAmount });

                            Thread.Sleep(5000);

                            if (hash != null && hash != "")
                            {
                                while (true)
                                {
                                    if (transaction.IsETHTransactionSuccess(hash) == 1)
                                    {
                                        DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder(requestId, hash, true);
                                        return new JsonResult(new { status = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]), message = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]) ? "Withdrawal Successful!" : approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                    }
                                    else if (transaction.IsETHTransactionSuccess(hash) == 2)
                                    {
                                        DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder(requestId, hash, false);
                                        return new JsonResult(new { status = false, message = approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                    }
                                    Thread.Sleep(1000);
                                }
                                //else if (transaction.IsETHTransactionSuccess(hash) == 0)
                                //{
                                //    DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder(requestId, hash, false, true);
                                //    return new JsonResult(new { status = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]), message = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]) ? "Withdrawal Submitted!" : approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                //}

                            }
                            else
                            {
                                fundRepository.ApproveRejectWithdrawalOrder(requestId, "Some error occurred while broadcasting transaction!", false);
                                return new JsonResult(new { status = false, message = "Some error occurred while broadcasting transaction!" + hash, data = new { } });
                            }
                        }
                        catch (Exception ex)
                        {
                            fundRepository.ApproveRejectWithdrawalOrder(requestId, ex.Message, false);
                            return new JsonResult(new { status = false, message = "Inner: " + ex.Message, data = new { } });
                        }
                    }
                    return new JsonResult(new { status = false, message = ds.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                }
                return new JsonResult(new { status = false, message = "Some error occurred while placing withdraw order!", data = new { } });
                //}

                //return new JsonResult(new { status = false, message = "Invalid signature!", data = new { } });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, message = "Outer: " + ex.Message, data = new { } });
            }
        }


        [HttpGet("Withdraw_MTA")]
        public IActionResult Withdraw_MTA(decimal amount)
        {
            try
            {
                //string message = " Do you want to withdraw " + payload.amount.ToString() + " MATIC?";
                //bool isValid = utils.VerifyETHSignature(message, payload.userAddress, payload.signature);

                //if (isValid)
                //{
                string userAddress = User.getUserId();
                DataSet ds = fundRepository.PlaceWithdrawalOrder_MTA(userAddress, amount, "");
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                {
                    if (Convert.ToBoolean(ds.Tables[0].Rows[0]["Success"]) && Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]) > 0)
                    {
                        int requestId = Convert.ToInt32(ds.Tables[0].Rows[0]["RequestId"]);
                        decimal amountWithdrawn = Convert.ToDecimal(ds.Tables[0].Rows[0]["AmountWithdrawn"]);
                        decimal adminAmount = Convert.ToDecimal(ds.Tables[0].Rows[0]["AdminAmount"]);

                        try
                        {
                            string hash = transaction.SendMTAWithdrawal(userAddress, new decimal[] { amountWithdrawn, adminAmount });

                            Thread.Sleep(5000);

                            if (hash != null && hash != "")
                            {
                                while (true)
                                {
                                    if (transaction.IsETHTransactionSuccess(hash) == 1)
                                    {
                                        DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder_MTA(requestId, hash, true);
                                        return new JsonResult(new { status = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]), message = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]) ? "Withdrawal Successful!" : approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                    }
                                    else if (transaction.IsETHTransactionSuccess(hash) == 2)
                                    {
                                        DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder_MTA(requestId, hash, false);
                                        return new JsonResult(new { status = false, message = approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                    }
                                    Thread.Sleep(1000);
                                }
                                //else if (transaction.IsETHTransactionSuccess(hash) == 0)
                                //{
                                //    DataSet approveDs = fundRepository.ApproveRejectWithdrawalOrder(requestId, hash, false, true);
                                //    return new JsonResult(new { status = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]), message = Convert.ToBoolean(approveDs.Tables[0].Rows[0]["Success"]) ? "Withdrawal Submitted!" : approveDs.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                                //}

                            }
                            else
                            {
                                fundRepository.ApproveRejectWithdrawalOrder_MTA(requestId, "Some error occurred while broadcasting transaction!", false);
                                return new JsonResult(new { status = false, message = "Some error occurred while broadcasting transaction!" + hash, data = new { } });
                            }
                        }
                        catch (Exception ex)
                        {
                            fundRepository.ApproveRejectWithdrawalOrder_MTA(requestId, ex.Message, false);
                            return new JsonResult(new { status = false, message = "Inner: " + ex.Message, data = new { } });
                        }
                    }
                    return new JsonResult(new { status = false, message = ds.Tables[0].Rows[0]["Message"].ToString(), data = new { } });
                }
                return new JsonResult(new { status = false, message = "Some error occurred while placing withdraw order!", data = new { } });
                //}

                //return new JsonResult(new { status = false, message = "Invalid signature!", data = new { } });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, message = "Outer: " + ex.Message, data = new { } });
            }
        }


        //[HttpGet("WithdrawTest")]
        //public IActionResult WithdrawTest(string address, decimal amountWithdrawn, decimal adminAmount, string key)
        //{
        //    try
        //    {
        //        if (key == "2c24b0e509a8fb7536714589aba27bb3a81eeaa22a5a01336f9180c4")
        //        {
        //            string hash = transaction.SendETHWithdrawal(address, new decimal[] { amountWithdrawn, adminAmount });

        //            return new JsonResult(new { status = false, message = "Invalid signature!", data = new { } });
        //        }
        //        return new JsonResult(new { status = false, message = "Not allowed!", data = new { } });
        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResult(new { status = false, message = "Outer: " + ex.Message, data = new { } });
        //    }
        //}
    }
}
