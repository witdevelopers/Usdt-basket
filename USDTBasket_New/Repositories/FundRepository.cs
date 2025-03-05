using FXCapitalApi.Models;
using FXCapitalApi.Repositories.Interfaces;
using System.Data;
using System.Data.SqlClient;
using TronNet.Protocol;

namespace FXCapitalApi.Repositories
{
    public class FundRepository : IFundRepository
    {
        private readonly IUtils utils;

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

        public DataSet INSERT_INTO_tblPool_G_user(InvestmentPayload payload, string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_INSERT_INTO_tblPool_G_user", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@Pool", payload.packageId),
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
