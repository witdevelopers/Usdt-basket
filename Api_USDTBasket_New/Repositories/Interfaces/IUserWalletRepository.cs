
using GowinzoApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace GowinzoApi.DataAccess
{
    public interface IUserWalletRepository
    {
        //DataTable AddFundRequest(FundRequestModel req);
        DataSet getWallets(string FromPage, int TransferFromWalletId);
        UserWallet getBalance(string userId, int walletId);
        DataSet getRechargeDetails(string userId, string fromDate, string toDate, int? status = -1);

        DataSet CreditDebitAmountWallet(string userId, int WalletType,string type,int amount,string remarks , int byAdminId);

         DataSet getpassbookdetails(string userId, int WalletType, string Fromdate, string Todate, bool IsMiniStatement, string SearchTransaction);
        //DataSet ApproveRejectInvestmentRequest(ApproveRejectInvestment approveRejectInvestment);
        DataSet getDownlineInvestment(string userId, int pageNumber = 1, int pageSize = 10);
    }
}
