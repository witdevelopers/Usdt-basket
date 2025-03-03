using FXCapitalApi.Models;

namespace FXCapitalApi.Repositories.Interfaces
{
    public interface ITransaction
    {
        TransactionValidity IsTransactionValid(string transactionHash, string userAddress);
        TransactionValidity IsTransactionValid_ETH(string transactionHash);

        TransactionValidity IsTransactionValid_NativeETHTokens(string transactionHash, decimal transactionAmount);
        TransactionValidity IsTransactionValid_ETH_Deposit(string transactionHash, decimal transactionAmount);
        bool IsTransactionSuccess(string transactionHash, int retry = 0);
        string SendETHWithdrawal(string toAddress, decimal[] amount);
        string SendMTAWithdrawal(string toAddress, decimal[] amount);
        int IsETHTransactionSuccess(string transactionHash, int retryCnt = 0);
    }
}
