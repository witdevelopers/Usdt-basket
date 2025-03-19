
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using GowinzoApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using TronNet.Protocol;

namespace GowinzoApi.DataAccess
{
    public class UserWalletRepository: IUserWalletRepository
    {
        private readonly IUtils util;

        public UserWalletRepository(IUtils util)
        {
            this.util = util;
        }
        //public DataTable AddFundRequest(FundRequestModel req)
        //{
        //    DataSet ds = util.ExecuteQuery("USP_InsertRequestForInvestment", new SqlParameter[] {
        //        new SqlParameter("@UserId", req.userId),
        //        new SqlParameter("@WalletId", "1"),
        //        new SqlParameter("@Amount", req.amount),
        //        new SqlParameter("@ModeOfPayment", "UPI"),
        //        new SqlParameter("@ReferenceNo", req.referenceNo),
        //        new SqlParameter("@ImagePath", req.imagePath),
        //        new SqlParameter("@Remarks", req.remarks),
        //        new SqlParameter("@AdminUPIId", req.adminUPI)
        //    });
        //    return ds.Tables[0];
        //}

        public DataSet getWallets(string FromPage, int TransferFromWalletId)
        {
            DataSet ds = util.ExecuteQuery("USP_GetWallets", new SqlParameter[] {
                new SqlParameter("@FromPage",FromPage),
                new SqlParameter("@TransferFromWalletId", TransferFromWalletId)
            });

            return ds;
        }

        public UserWallet getBalance(string userId, int walletId)
        {
            DataSet ds = util.ExecuteQuery("USP_GetWalletBalance", new SqlParameter[] {
                new SqlParameter("@UserId",userId),
                new SqlParameter("@WalletType", walletId)
            });
            
            var _wallet = new UserWallet()
            {
               Balance=0,Commission=0,Interest=0
            };

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                _wallet.Balance = Convert.ToDecimal(ds.Tables[0].Rows[0]["BalanceAmount"]);
                //_wallet.Commission = Convert.ToDecimal(ds.Tables[0].Rows[0]["CommissionAmount"]);
                //_wallet.Interest = Convert.ToDecimal(ds.Tables[0].Rows[0]["LevelIncome"]);
            }

            return _wallet;
        }

        public DataSet getRechargeDetails(string userId,string fromDate,string toDate,int? status=-1)
        {
            DataSet ds = util.ExecuteQuery("USP_GetRequestsForInvestment", new SqlParameter[] {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate",toDate),
                new SqlParameter("@Status",status),
          
            });
            return ds;
        }

    public DataSet CreditDebitAmountWallet(string userId, int WalletType, string type, int amount, string remarks, int byAdminId)
    {
      DataSet ds = util.ExecuteQuery("USP_CreditDebitAmount_Wallet", new SqlParameter[] {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@WalletType", WalletType),
                new SqlParameter("@Type", type),
                new SqlParameter("@Amount", amount),
                new SqlParameter("@Remarks", remarks),
                new SqlParameter("@ByAdminId", byAdminId)
            });
      return ds;
    }

    public DataSet getDownlineInvestment(string userId, int pageNumber = 1, int pageSize = 10)
        {
            DataSet ds = util.ExecuteQuery("USP_GetDownlineInvestment", new SqlParameter[] {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@PageNo", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            });
            return ds;
        }

        public DataSet getpassbookdetails(string userId , int WalletType ,string Fromdate , string Todate , bool IsMiniStatement , string SearchTransaction)
        {
            DataSet ds = util.ExecuteQuery("USP_GetPassbook", new SqlParameter[] {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@WalletType", WalletType),
                new SqlParameter("@Fromdate", Fromdate),
                new SqlParameter("@Todate", Todate),
                new SqlParameter("@IsMiniStatement", IsMiniStatement),
                new SqlParameter("@SearchTransaction", SearchTransaction)
            });
            return ds;
        }




        //public DataSet ApproveRejectInvestmentRequest(ApproveRejectInvestment approveRejectInvestment)
        //{
        //    DataTable dt = new DataTable();
        //    dt.Columns.Add("RequestId");
        //    dt.Columns.Add("AdminRemarks");

        //    DataRow dr = dt.NewRow();
        //    dr["RequestId"] = approveRejectInvestment.RequestId;
        //    dr["AdminRemarks"] = approveRejectInvestment.AdminRemarks;

        //    dt.Rows.Add(dr);

        //    DataSet ds = util.ExecuteQuery("USP_ApproveRejectInvestmentRequest", new SqlParameter[] {
        //        new SqlParameter("@ApproveRejectRequestDetails", dt),
        //        new SqlParameter("@Status", approveRejectInvestment.Status),
        //        new SqlParameter("@AdminId", approveRejectInvestment.AdminId)
        //    });
        //    return ds;
        //}
    }
}
