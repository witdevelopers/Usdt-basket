using FXCapitalApi.Models;
using FXCapitalApi.Repositories.Interfaces;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Security.Policy;
using TronNet.Protocol;
using static FXCapitalApi.Controllers.FundController;
using Nethereum.JsonRpc.Client;
using System.Threading.Tasks;
using Org.BouncyCastle.Asn1.IsisMtt.Ocsp;
using System.IO;
using System.Net;
using System.Text;

namespace FXCapitalApi.Repositories
{
    public class FundRepository : IFundRepository
    {
        private readonly IUtils utils;
       private static readonly string apiKey = "9FIC2QEIFT24GVW8Y3P1XIBPS6CVMHGW3Z";
       private static readonly string apiUrl = "https://api.polygonscan.com/api";
        private static readonly string transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

        public FundRepository(IUtils utils)
        {
            this.utils = utils;
        }

        public DataSet Invest(InvestmentPayload payload, string userAddress, decimal transactionAmount)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertTopupDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@TransactionHash", payload.transactionHash),
                new SqlParameter("@PinValue", transactionAmount),
                new SqlParameter("@IsReinvest", true),
                new SqlParameter("@PackageId", payload.packageId),
                new SqlParameter("@PaymentMode", "MATIC")
            });
            return ds;
        }
        
        public Hashdetails getHash( string txHash)
        {
            //var apiKey = utils.GetRPCUrl();
             Hashdetails obj = new Hashdetails();
            obj.HashID = txHash;
              var transfers = new List<ERC20Transfer>();
            using (HttpClient client = new HttpClient())
            {
                string url = "https://api.polygonscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=" + txHash + "&apikey=" + apiKey;

                //HttpResponseMessage response =  client.GetAsync(url);
                //string result = await response.Content.ReadAsStringAsync();
                //var result = client.GetAsync(url).GetAwaiter().GetResult();


                HttpWebRequest request4 = (HttpWebRequest)WebRequest.Create(url);
                request4.Method = "get";
                HttpWebResponse response4 = (HttpWebResponse)request4.GetResponse();
                Stream s24 = response4.GetResponseStream();
                StreamReader Reader24 = new StreamReader(s24, Encoding.UTF8);
                string strValue24 = "";
                strValue24 = Reader24.ReadToEnd();



                JObject json = JObject.Parse(strValue24);

                if (json["result"] != null && json["result"]["logs"] != null)
                {
                    obj.Status = json["result"]["status"]?.ToString() == "0x1" ? "Success" : "Failed";
                    obj.contractAddress = json["result"]["to"]?.ToString();
                    var logs = json["result"]["logs"];
                    foreach (var log in logs)
                    {
                        string topic0 = log["topics"]?[0]?.ToString();
                        if (topic0 == transferTopic)
                        {
                            string tokenAddress = log["address"]?.ToString();
                            string from = "0x" + log["topics"]?[1]?.ToString().Substring(26);
                            string to = "0x" + log["topics"]?[2]?.ToString().Substring(26);
                            decimal value = Convert.ToInt64(log["data"]?.ToString(), 16) / 1_000_000M; // For USDT (6 decimals)
                            if (value == 2 && to != "0x96e6981d848fD97606705b3137Ab9401ECD8CB9B")
                            {
                                obj.ToAddress = to;
                                obj.TokenAddress = tokenAddress;
                                obj.fromAddress = from;
                                obj.Amount = value;
                            }
                            if (value > 2)
                            {
                                obj.ToAddress = to;
                                obj.TokenAddress = tokenAddress;
                                obj.fromAddress = from;
                                obj.Amount = value;

                            }


                        }
                    }


                }
                else
                {
                    Console.WriteLine("Transaction not found or invalid hash.");
                }
            }
            return obj;

        }


        public  DataSet INSERT_INTO_tblPool_G_user(InvestmentPayload payload, string userAddress,string Hash)
        {
            Hashdetails obj = new Hashdetails();
            obj= getHash(Hash);

            DataSet ds = utils.ExecuteQuery("USP_INSERT_INTO_tblPool_G_user", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@Pool", payload.packageId),
                new SqlParameter("@HashId", obj.HashID),
                new SqlParameter("@FromAddress", obj.fromAddress),
                new SqlParameter("@ToAddress", obj.ToAddress),
                new SqlParameter("@adminAddress", obj.ToAddress),
                new SqlParameter("@toadminAmount", obj.Amount),
                new SqlParameter("@totalAmount", obj.Amount),
                new SqlParameter("@contractAddress", obj.contractAddress),
                 new SqlParameter("@tokenaddress", obj.TokenAddress),
                  new SqlParameter("@status", obj.Status),



            });
            return ds;
        }
        //for Crypto
        public DataSet PlaceWithdrawalOrder(string userAddress, int WalletId, decimal amount, string signature)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertRequestForWithdrawal", new SqlParameter[] 
            {
                new SqlParameter("@UserId", userAddress),
                 new SqlParameter("@WalletId", WalletId),
                new SqlParameter("@Amount", amount),
                new SqlParameter("@Remarks", signature)
            });
            return ds;
        }

        //for mlm
        public DataSet PlaceWithdrawalOrder_Mlm(string userAddress, int WalletId, decimal amount, string remarks)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertRequestForWithdrawal", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                 new SqlParameter("@WalletId", WalletId),
                new SqlParameter("@Amount", amount),
                new SqlParameter("@Remarks", remarks)
            });
            return ds;
        }

        public DataSet RequestForInvestment(string userID, decimal amount, string ModeOfPayment, string ReferenceNo, string Remarks)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertRequestForInvestment", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),                 
                new SqlParameter("@Amount", amount),
                new SqlParameter("@ModeOfPayment", ModeOfPayment),
                new SqlParameter("@ReferenceNo", ReferenceNo),
                new SqlParameter("@Remarks", Remarks)
            });
            return ds;
        }

    public DataSet InsertHashKey(string HashKey, string FromAddress, string ToAddress, string adminAddress, decimal toadminAmount, decimal totalAmount, string contractAddress)
    {

            Hashdetails obj = new Hashdetails();
            obj = getHash(HashKey);
            DataSet ds = utils.ExecuteQuery("USP_InsertHashvalue", new SqlParameter[]
      {
                new SqlParameter("@HashId", HashKey),
                new SqlParameter("@FromAddress", obj.fromAddress),
                new SqlParameter("@ToAddress", obj.ToAddress),
                new SqlParameter("@adminAddress", obj.ToAddress),
                new SqlParameter("@toadminAmount",  obj.Amount),
                new SqlParameter("@totalAmount",  obj.Amount),
                new SqlParameter("@contractAddress", obj.contractAddress),
                new SqlParameter("@tokenaddress", obj.TokenAddress),
                new SqlParameter("@status", obj.Status),

      }); ;
      return ds;
    }

    public DataSet getHashcheck(DataTable dt)
    {
      DataSet obj = new DataSet();
      DataSet ds = utils.ExecuteQuery("Inserthashcheck", new SqlParameter[]
      {
                new SqlParameter("@userhash", dt)

      });
      if (ds.Tables.Count > 0)
      {
        if (ds.Tables[0].Rows.Count > 0)
        {
          foreach (DataRow row in ds.Tables[0].Rows)
          {
            InsertHashKey(row["Hash"].ToString(), "", "", "", 0, 0, "");

          }
        }


      }



      return obj;
    }

    public DataSet GetRequestForInvestment(string userID)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetRequestsForInvestment", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID)
                
            });
            return ds;
        }

    public DataSet CheckSponsorIncome(string userID)
    {
      DataSet ds = utils.ExecuteQuery("USP_CheckSponsor", new SqlParameter[]
      {
                new SqlParameter("@UserId", userID)

      });
      return ds;
    }


    public DataSet GetRequestsForWithdrawal(string UserId, string Fromdate, string Todate, int? Status)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetRequestsForWithdrawal", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId),
                 new SqlParameter("@Fromdate", Fromdate),
                new SqlParameter("@Todate", Todate),
                new SqlParameter("@Status", Status)
            });
            return ds;
        }

        //For Mlm
        public DataSet GetWithdrawalOrder_Mlm(string UserId, string Fromdate, string Todate, int? Status)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetRequestsForWithdrawal", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId),
                 new SqlParameter("@Fromdate", Fromdate),
                new SqlParameter("@Todate", Todate),
                new SqlParameter("@Status", Status)
            });
            return ds;
        }



        public DataSet PlaceWithdrawalOrder_crypto(string userId, int WalletId, decimal amount, string signature)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertRequestForWithdrawal", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                   new SqlParameter("@WalletId", WalletId),
                new SqlParameter("@Amount", amount),
                new SqlParameter("@Remarks", signature)
            });
            return ds;
        }

        public DataSet PlaceWithdrawalOrder_MTA(string userAddress, decimal amount, string signature)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertRequestForWithdrawal_MTA", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@Amount", amount),
                new SqlParameter("@Remarks", signature)
            });
            return ds;
        }

        public DataSet ApproveRejectWithdrawalOrder(int requestId, string adminRemarks, bool status, bool isPending=false)
        {
            DataTable dtData = new DataTable();
            dtData.Columns.Add("RequestId", typeof(int));
            dtData.Columns.Add("AdminRemarks", typeof(string));

            dtData.Rows.Add(requestId, adminRemarks);

            DataSet ds = utils.ExecuteQuery("USP_ApproveRejectWithdrawalRequest", new SqlParameter[]{
                new SqlParameter("@ApproveRejectRequestDetails", dtData),
                new SqlParameter("@Status", isPending?0:(status?1:2)),
                new SqlParameter("@AdminId", 1)
            });

            return ds;
        }

        public DataSet ApproveRejectWithdrawalOrder_MTA(int requestId, string adminRemarks, bool status, bool isPending = false)
        {
            DataTable dtData = new DataTable();
            dtData.Columns.Add("RequestId", typeof(int));
            dtData.Columns.Add("AdminRemarks", typeof(string));

            dtData.Rows.Add(requestId, adminRemarks);

            DataSet ds = utils.ExecuteQuery("USP_ApproveRejectWithdrawalRequest_MTA", new SqlParameter[]{
                new SqlParameter("@ApproveRejectRequestDetails", dtData),
                new SqlParameter("@Status", isPending?0:(status?1:2)),
                new SqlParameter("@AdminId", 1)
            });

            return ds;
        }

        public DataSet SellTokens(string userAddress, decimal amount)
        {
            DataSet ds = utils.ExecuteQuery("USP_SellToken", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@TokenAmount", amount)
            });
            return ds;
        }

        public DataSet ApproveRejectTokenSellRequest(int requestId, string txnHash, int status)
        {
            DataSet ds = utils.ExecuteQuery("USP_ApproveRejectTokenSell", new SqlParameter[]{
                new SqlParameter("@RequestId", requestId),
                new SqlParameter("@TxnHash", txnHash),
                new SqlParameter("@Status", status)
            });

            return ds;
        }

    }
}
