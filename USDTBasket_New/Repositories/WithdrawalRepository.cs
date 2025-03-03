using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using FXCapitalApi.Repositories.Interfaces;
using GowinzoApi.Models;
namespace GowinzoApi.DataAccess
{
    public class WithdrawalRepository : IWithdrawalRepository
    {
        private readonly IUtils util;

        public WithdrawalRepository(IUtils util)
        {
            this.util = util;
        }

        public DataTable addWithdrawalRequest(WithdrawalModel withdrawal)
        {
            DataSet ds = util.ExecuteQuery("USP_InsertRequestForWithdrawal", new SqlParameter[] {
                    new SqlParameter("@UserId", withdrawal.UserId),
                    new SqlParameter("@WalletId",1),
                    new SqlParameter("@Amount", withdrawal.Amount),
                    new SqlParameter("@Remarks", withdrawal.MemberRemarks)
                });
            return ds.Tables[0];
        }



        public List<WithdrawalModel> getWithdrawalRequests(string userId, string fromDate = "", string toDate = "", int status = -1)
        {
            var rs = new List<WithdrawalModel>();
            DataTable dt = util.ExecuteQuery("USP_GetRequestsForWithdrawal", new SqlParameter[]{
            new SqlParameter("@UserId", userId),
            new SqlParameter("@Fromdate", fromDate),
            new SqlParameter("@Todate", toDate),
            new SqlParameter("@Status", status)
            }).Tables[0];

            foreach (DataRow row in dt.Rows)
            {
                rs.Add(new WithdrawalModel
                {
                    Srno = Convert.ToInt32(row["Srno"]),
                    RequestId = Convert.ToInt32(row["RequestId"]),
                    UserId = row["UserId"].ToString(),
                    Name = row["Name"].ToString(),
                    Amount = Convert.ToDecimal(row["Amount"]),
                    OnDate = Convert.ToDateTime(row["Ondate"]),
                    MemberRemarks = row["MemberRemarks"].ToString(),
                    Status = row["Status"].ToString(),
                    AdminRemarks = row["AdminRemarks"].ToString(),
                    AcceptRejectDate =(!string.IsNullOrEmpty(row["AcceptRejectDate"].ToString()))?Convert.ToDateTime(row["AcceptRejectDate"]):null,
                    BankDetails = row["BankDetails"].ToString(),
                });
            }

            return rs;
        }

        public DataTable approveRejectRequests(List<WithdrawalModel> data,int status,int AdminId)
        {
            DataTable dtData = new DataTable();
            dtData.Columns.Add("RequestId", typeof(int));
            dtData.Columns.Add("AdminRemarks", typeof(string));
            foreach(var item in data)
            {
                dtData.Rows.Add(item.RequestId, item.AdminRemarks);
            }
            DataSet ds = util.ExecuteQuery("USP_ApproveRejectWithdrawalRequest", new SqlParameter[]{
                new SqlParameter("@ApproveRejectRequestDetails", dtData),
                new SqlParameter("@Status", status),
                new SqlParameter("@AdminId", AdminId)
            });
            return ds.Tables[0];
        }

        public DataSet getPassbook(PassbookPayload passbook)
        {
            DataSet ds = util.ExecuteQuery("USP_GetTransactions", new SqlParameter[]{
                new SqlParameter("@UserId", passbook.userId),
                new SqlParameter("@pageNo", passbook.pageNo),
                new SqlParameter("@pageSize", passbook.pageSize)
            });
            return ds;
        }


    }
}
