using FXCapitalApi.Models;
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nethereum.BlockchainProcessing.BlockStorage.Entities;
using Nethereum.Web3;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net.Http;
using System.Text.Json;
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
        private static readonly string apiKey = "9FIC2QEIFT24GVW8Y3P1XIBPS6CVMHGW3Z";
        private static readonly string apiUrl = "https://api.polygonscan.com/api";
        private static readonly string transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
       
        
        public class ERC20Transfer
        {
            public string From { get; set; }
            public string To { get; set; }
            public decimal Value { get; set; }
        }
        [HttpGet("TransactionValue")]
        public async Task<IActionResult> TransactionValue(string txHash)
        
        {
            txHash = "0x8bb68b2667a2c1e9b5941f8b0fb51b51b85e9771043081d2f0eac24c470b7b34";
            var transfers = new List<ERC20Transfer>();
            using (HttpClient client = new HttpClient())
            {
                string url = $"{apiUrl}?module=proxy&action=eth_getTransactionReceipt&txhash={txHash}&apikey={apiKey}";

                HttpResponseMessage response = await client.GetAsync(url);
                string result = await response.Content.ReadAsStringAsync();
                //var result = client.GetAsync(url).GetAwaiter().GetResult();
                JObject json = JObject.Parse(result);

                if (json["result"] != null && json["result"]["logs"] != null)
                {
                  var  status = json["result"]["status"]?.ToString() == "0x1" ? "Success" : "Failed";
                    var contractAddress = json["result"]["to"]?.ToString();
                    var logs = json["result"]["logs"]; 
                    foreach (var log in logs)
                    {
                        string topic0 = log["topics"]?[0]?.ToString();
                        if (topic0 == transferTopic)
                        {
                            string contractAddress1 = log["address"]?.ToString();
                            string from = "0x" + log["topics"]?[1]?.ToString().Substring(26);
                            string to = "0x" + log["topics"]?[2]?.ToString().Substring(26);
                            decimal value = Convert.ToInt64(log["data"]?.ToString(), 16) / 1_000_000M; // For USDT (6 decimals)

                            
                        }
                    }

                   
                }
                else
                {
                    Console.WriteLine("Transaction not found or invalid hash.");
                }
            }



            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });

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


    public class Transaction
    {
      public string BlockNumber { get; set; }
      public string TimeStamp { get; set; }
      public string Hash { get; set; }
      public string From { get; set; }
      public string To { get; set; }
      public string Value { get; set; }
      public string Gas { get; set; }
      public string GasPrice { get; set; }
      public string ContractAddress { get; set; }
      public string txreceipt_status { get; set; }
      public string Status => txreceipt_status == "1" ? "Success" : "Failed";
      public decimal USDTAmount => decimal.Parse(Value) / 1_000_000m;
    }

    public class PolygonResponse
    {
      public string Status { get; set; }
      public string Message { get; set; }
      public List<Transaction> Result { get; set; }
    }

    [HttpGet("Getalltransactioncontractdata")]
    public async Task<IActionResult> Getalltransactioncontractdata(string HashKey)

    {


      string url = "https://api.polygonscan.com/api?module=account&action=txlist&address=0x32522067B5Dc3A56f1D12DaaaF9B332C5d01332D&startblock=0&endblock=99999999&sort=desc&apikey=9FIC2QEIFT24GVW8Y3P1XIBPS6CVMHGW3Z&page=1&offset=50";


      HttpClient obdd = new HttpClient();
      HttpResponseMessage response = await obdd.GetAsync(url);

      if (response.IsSuccessStatusCode)
      {
        string jsonResponse = await response.Content.ReadAsStringAsync();
        PolygonResponse polygonResponse1 = System.Text.Json.JsonSerializer.Deserialize<PolygonResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        DataTable userhash = new DataTable("userhash");
        userhash.Columns.Add("Hash", typeof(String));
        userhash.Columns.Add("From", typeof(String));
        userhash.Columns.Add("To", typeof(String));
        for (int i = 0; i < polygonResponse1.Result.Count; i++)
        {
          if (polygonResponse1.Result[i].Status == "Success")
          {
            userhash.Rows.Add(polygonResponse1.Result[i].Hash, polygonResponse1.Result[i].From, polygonResponse1.Result[i].To);
          }

        }
        DataSet dd = new DataSet();
        dd = fundRepository.getHashcheck(userhash);

      }
      else
      {
        throw new Exception("Failed to fetch data from PolygonScan.");
      }


      // return Ok("");
      //DataSet ds = fundRepository.Getalltransactioncontract();
      return new JsonResult(new { status = false, message = "Outer: " + "", data = new { } });
    }



    [HttpGet("InsertHashKeynew")]
        public  IActionResult  InsertHashKeynew(string HashKey)
        
        {


            TransactionValidity transactionValidity = transaction.IsTransactionValid_NativeETHTokens("0x5e11f70f1d94c09ae930188a1d03ff7a6141a400927385589b4310df428dc405", 2);

            DataSet ds = fundRepository.InsertHashKey(HashKey, "", "", "",2, 2, "");
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }


        [HttpPost("Invest")]
        public IActionResult Invest(InvestmentPayload payload)
        {
             TransactionValidity transactionValidity = transaction.IsTransactionValid_NativeETHTokens(payload.transactionHash, payload.Amount);

            
            
            if (transactionValidity.isValid)
            {
                DataSet ds = fundRepository.INSERT_INTO_tblPool_G_user(payload, transactionValidity.fromAddress, payload.transactionHash);

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
