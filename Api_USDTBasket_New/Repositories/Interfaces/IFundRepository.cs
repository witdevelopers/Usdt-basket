using FXCapitalApi.Models;
using System.Data;

namespace FXCapitalApi.Repositories.Interfaces
{
    public interface IFundRepository
    {
        DataSet Invest(InvestmentPayload payload, string userAddress, decimal transactionAmount);

        DataSet INSERT_INTO_tblPool_G_user(InvestmentPayload payload, string userAddress, string Hash);
        DataSet PlaceWithdrawalOrder(string userAddress,int WalletId, decimal amountUSDT, string signature);
        DataSet RequestForInvestment(string userID, decimal amount, string ModeOfPayment, string ReferenceNo, string Remarks);
        DataSet InsertHashKey(string HashKey, string FromAddress, string ToAddress, string adminAddress, decimal toadminAmount, decimal totalAmount, string contractAddress);
   
        DataSet getHashcheck(DataTable dt);
    DataSet GetRequestForInvestment(string userID);
        DataSet PlaceWithdrawalOrder_MTA(string userAddress, decimal amount, string signature);
        DataSet GetWithdrawalOrder_Mlm(string UserId, string Fromdate, string Todate, int? Status);

        DataSet GetRequestsForWithdrawal(string UserId, string Fromdate, string Todate, int? Status);
        DataSet PlaceWithdrawalOrder_crypto(string UserId, int WalletId, decimal amount, string signature);
        DataSet PlaceWithdrawalOrder_Mlm(string UserId, int WalletId, decimal amount, string remard);
        DataSet ApproveRejectWithdrawalOrder(int requestId, string adminRemarks, bool status, bool isPending = false);
        DataSet ApproveRejectWithdrawalOrder_MTA(int requestId, string adminRemarks, bool status, bool isPending = false);
        DataSet SellTokens(string userAddress, decimal amount);
        DataSet ApproveRejectTokenSellRequest(int requestId, string txnHash, int status);
        DataSet CheckSponsorIncome(string userAddress);
  }
}
