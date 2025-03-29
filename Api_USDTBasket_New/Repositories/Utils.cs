using FXCapitalApi.Models;
using FXCapitalApi.Repositories.Interfaces;
using Google.Protobuf;
using Microsoft.Extensions.Configuration;
using Nethereum.Signer;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using TronNet;
using TronNet.Crypto;
using TronNet.Protocol;

using TronTransaction = TronNet.Protocol.Transaction;

namespace FXCapitalApi.Repositories
{
    public class Utils : IUtils
    {
        private readonly IConfiguration configuration;
        private string connectionString;


        private readonly ITransactionClient _transactionClient;
        private readonly IWalletClient _wallet;

        public Utils(IConfiguration _configuration, ITransactionClient transactionClient, IWalletClient wallet)
        {
            configuration = _configuration;
            connectionString = configuration.GetConnectionString("connectionString");

            _transactionClient = transactionClient;
            _wallet = wallet;
        }

        public string GetContractAddress()
        {
            return configuration.GetValue<string>("AppSettings:contractAddress").ToLower();
        }

        public string GetRPCUrl()
        {
            return configuration.GetValue<string>("AppSettings:RPCUrl").ToLower();
        }

        public int GetGasPrice()
        {
            return configuration.GetValue<int>("AppSettings:GasPrice");
        }

        public int GetGasLimit()
        {
            return configuration.GetValue<int>("AppSettings:GasLimit");
        }

        public string GetCreatorWalletAddress()
        {
            return configuration.GetValue<string>("AppSettings:creatorWalletAddress").ToLower();
        }

        public string GetApiBaseUrl()
        {
            return configuration.GetValue<string>("AppSettings:ApiBaseUrl");
        }

        public string GetTokenAddress()
        {
            return configuration.GetValue<string>("AppSettings:tokenAddress");
        }

        public DataSet ExecuteQuery(string spName, params SqlParameter[] a)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataSet ds = new DataSet();
                SqlDataAdapter sda = new SqlDataAdapter(spName, connection);
                sda.SelectCommand.CommandType = CommandType.StoredProcedure;
                if (a != null && a.Length > 0)
                { sda.SelectCommand.Parameters.AddRange(a); }

                sda.Fill(ds);
                return ds;
            }
        }

        public int ExecuteNonQuery(string spName, params SqlParameter[] a)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(spName, connection);
                cmd.CommandType = CommandType.StoredProcedure;

                if (a != null && a.Length > 0)
                { cmd.Parameters.AddRange(a); }

                connection.Open();

                int r = cmd.ExecuteNonQuery();

                connection.Close();
                return r;
            }
        }

        public DataSet ExecuteQuery(string spName)
        {
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                DataSet ds = new DataSet();
                SqlDataAdapter sda = new SqlDataAdapter(spName, connection);
                sda.SelectCommand.CommandType = CommandType.StoredProcedure;

                sda.Fill(ds);
                return ds;
            }
        }

        public bool VerifyETHSignature(string messageString, string ethAddress, string signatureHex)
        {
            try
            {
                string ETH_MESSAGE_HEADER = "\x19"+"Ethereum Signed Message:\n"+messageString.Length.ToString();

                messageString = ETH_MESSAGE_HEADER + messageString;


                var signer = new MessageSigner();
                var recoveredAddress = signer.HashAndEcRecover(messageString, signatureHex);

                return recoveredAddress.ToUpper() == ethAddress.ToUpper();
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public bool VerifyTronSignature(string messageString, string base58Address, string signatureHex)
        {
            try
            {
                const string TRX_MESSAGE_HEADER = "\x19TRON Signed Message:\n32";

                //const string ETH_MESSAGE_HEADER = "\x19Ethereum Signed Message:\n32";
                const string ADDRESS_PREFIX = "41";

                messageString = TRX_MESSAGE_HEADER + messageString;

                var signer = new MessageSigner();
                var recoveredAddress = signer.HashAndEcRecover(messageString, signatureHex);

                string tronAddress = recoveredAddress.Substring(2);

                string recoveredBase58Address = Base58Encoder.EncodeFromHex(tronAddress, ADDRESS_PREFIX.HexToByteArray()[0]);

                return recoveredBase58Address.ToUpper() == base58Address.ToUpper();
            }
            catch(Exception e)
            {
                return false;
            }
        }

        async public Task<string> sendTokenFromContract(string userAddress, decimal amountUSDT)
        {

            var privateKey = "99b5d114e8034de6ff8a351d0778b0a3440465d9b6965f404a614462ec356890";
            var ownerAccount = _wallet.GetAccount(privateKey);


            byte[] ownerAddressBytes = Base58Encoder.DecodeFromBase58Check(ownerAccount.Address);
            byte[] contractAddressBytes = Base58Encoder.DecodeFromBase58Check(GetContractAddress());

            //Function Parameters
            byte[] tokenAddressBytes = Base58Encoder.DecodeFromBase58Check(GetTokenAddress());
            byte[] fromAddressBytes = Base58Encoder.DecodeFromBase58Check("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb");
            byte[] toAddressBytes = Base58Encoder.DecodeFromBase58Check(userAddress);

            decimal num = amountUSDT * Convert.ToDecimal(Math.Pow(10, 6));


            byte[] contractAddressNumArray = new byte[20];
            Array.Copy(contractAddressBytes, 1, contractAddressNumArray, 0, contractAddressNumArray.Length);
            string contractAddressString = "0x" + contractAddressNumArray.ToHex();

            byte[] tokenAddressNumArray = new byte[20];
            Array.Copy(tokenAddressBytes, 1, tokenAddressNumArray, 0, tokenAddressNumArray.Length);
            string tokenAddressString = "0x" + tokenAddressNumArray.ToHex();

            byte[] fromAddressNumArray = new byte[20];
            Array.Copy(fromAddressBytes, 1, fromAddressNumArray, 0, fromAddressNumArray.Length);
            string fromAddressString = "0x" + fromAddressNumArray.ToHex();

            byte[] toAddressNumArray = new byte[20];
            Array.Copy(toAddressBytes, 1, toAddressNumArray, 0, toAddressNumArray.Length);
            string toAddressString = "0x" + toAddressNumArray.ToHex();

            string str2 = new Utilities.ParametersEncoder().EncodeRequest(new TransferTokenFunction()
            {
                _TokenAddress = tokenAddressString,
                _FromAddress = fromAddressString,
                _ToAddress = toAddressString,
                _TokenAmount = (BigInteger)Convert.ToInt64(num)
            }, "2c54de4f");

            TransactionExtention transactionExtention = await _wallet.GetProtocol().TriggerContractAsync(new TriggerSmartContract()
            {
                ContractAddress = ByteString.CopyFrom(contractAddressBytes),
                OwnerAddress = ByteString.CopyFrom(ownerAddressBytes),
                Data = ByteString.CopyFrom(str2.HexToByteArray())
            }, _wallet.GetHeaders());

            TronTransaction transaction = transactionExtention.Transaction;

            if (transaction.Ret.Count > 0 && transaction.Ret[0].Ret == TronTransaction.Types.Result.Types.code.Failed)
            {
                throw new Exception("Transaction failed");
            }

            transaction.RawData.Data = ByteString.CopyFromUtf8("Transfer token from contract");
            transaction.RawData.FeeLimit = 10000000L;
            TronTransaction transSign = this._transactionClient.GetTransactionSign(transaction, ownerAccount.PrivateKey);
            var res = await this._transactionClient.BroadcastTransactionAsync(transSign);
            return transSign.GetTxid();
        }
    }
}
