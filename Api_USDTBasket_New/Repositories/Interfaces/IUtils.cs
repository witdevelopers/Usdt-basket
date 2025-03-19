using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace FXCapitalApi.Repositories.Interfaces
{
    public interface IUtils
    {
        DataSet ExecuteQuery(string spName, params SqlParameter[] a);
        int ExecuteNonQuery(string spName, params SqlParameter[] a);
        DataSet ExecuteQuery(string spName);
        string GetContractAddress();
        string GetRPCUrl();
        int GetGasPrice();
        int GetGasLimit();
        string GetCreatorWalletAddress();
        bool VerifyETHSignature(string messageString, string address, string signatureHex);
        bool VerifyTronSignature(string messageString, string address, string signatureHex);
        string GetApiBaseUrl();
        string GetTokenAddress();
        Task<string> sendTokenFromContract(string userAddress, decimal amountUSDT);
    }
}
