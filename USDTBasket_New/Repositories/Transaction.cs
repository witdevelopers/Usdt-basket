using FXCapitalApi.Models;
using FXCapitalApi.Repositories.Interfaces;
using Nancy.Json;
using Nethereum.ABI;
using Nethereum.BlockchainProcessing.BlockStorage.Entities.Mapping;
using Nethereum.Hex.HexConvertors.Extensions;
using Nethereum.Hex.HexTypes;
using Nethereum.RPC.Eth.DTOs;
using Nethereum.Util;
using Nethereum.Web3;
using RestSharp;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Numerics;
using System.Text;
using System.Threading;

namespace FXCapitalApi.Repositories
{
    public class Transaction : ITransaction
    {
        private readonly IUtils utils;

        public Transaction(IUtils utils)
        {
            this.utils = utils;
        }

        public TransactionValidity IsTransactionValid(string transactionHash, string userAddress)
        {
            string url = $"https://apilist.tronscan.org/api/transaction-info?hash=" + transactionHash;

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                //var content = new StringContent(@"{""value"":'" + transactionHash + "'}", Encoding.UTF8, "application/json");
                var response = client.GetAsync("").GetAwaiter().GetResult();
                var transactionResult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                var json = new JavaScriptSerializer().Deserialize<dynamic>(transactionResult);

                if (json["contractRet"].ToString() == "SUCCESS" && json["ownerAddress"].ToString().ToUpper() == userAddress.ToUpper() && json["toAddress"].ToString().ToUpper() == utils.GetContractAddress().ToUpper())
                {
                    var info = json["tokenTransferInfo"];
                    if (info != null && info["contract_address"].ToString().ToUpper() == utils.GetTokenAddress().ToUpper()
                        &&
                       info["from_address"].ToString().ToUpper() == userAddress.ToUpper()
                        &&
                       info["to_address"].ToString().ToUpper() == utils.GetContractAddress().ToUpper())
                    {
                        decimal transactionAmount = Convert.ToDecimal(info["amount_str"]) / 1000000;
                        if (transactionAmount > 0)
                        {
                            return new TransactionValidity { isValid = true, transactionAmount = transactionAmount };
                        }
                    }
                }
            }

            return new TransactionValidity { isValid = false, transactionAmount = 0 };
        }

        public TransactionValidity IsTransactionValid_ETH(string transactionHash)
        {
            try
            {
                Thread.Sleep(2000);
                var web3 = new Web3(utils.GetRPCUrl());
                var receiptStatus = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                if (receiptStatus != null && receiptStatus.Status.Value == 1)
                {
                    var transaction = web3.Eth.Transactions.GetTransactionByHash.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                    if (transaction != null && transaction.To.ToLower() == utils.GetContractAddress())
                    {
                        return new TransactionValidity { isValid = true, fromAddress = transaction.From, transactionAmount = Web3.Convert.FromWei(transaction.Value.Value, UnitConversion.EthUnit.Ether), data = transaction.Input };
                    }
                }
            }
            catch (Exception e)
            {

            }
            return new TransactionValidity { isValid = false, fromAddress = "", transactionAmount = 0, data = "" };
        }
      public TransactionValidity IsTransactionValid_NativeETHTokens(string transactionHash, decimal transactionAmount)
        {
            try
            {
                Thread.Sleep(2000);
                var web3 = new Web3(utils.GetRPCUrl());
                var receiptStatus = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                if (receiptStatus != null && receiptStatus.Status.Value == 1)
                {
                    var transaction = web3.Eth.Transactions.GetTransactionByHash.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                    if (transaction != null) //&& transactionAmount==4  
                    {
                        return new TransactionValidity { isValid = true, fromAddress = transaction.From, transactionAmount = transactionAmount, data = transaction.Input };
                    }
                }
            }
            catch (Exception e)
            {

            }
            return new TransactionValidity { isValid = false, fromAddress = "", transactionAmount = 0, data = "" };
        }

        public TransactionValidity IsTransactionValid_ETH_Deposit(string transactionHash, decimal transactionAmount)
        {
            try
            {
                Thread.Sleep(2000);
                var web3 = new Web3(utils.GetRPCUrl());
                var receiptStatus = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                if (receiptStatus != null && receiptStatus.Status.Value == 1)
                {
                    var transaction = web3.Eth.Transactions.GetTransactionByHash.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                    if (transaction != null && transaction.To.ToLower() == utils.GetContractAddress())
                    {
                        return new TransactionValidity { isValid = true, fromAddress = transaction.From, transactionAmount = transactionAmount, data = transaction.Input };
                    }
                }
            }
            catch (Exception e)
            {

            }
            return new TransactionValidity { isValid = false, fromAddress = "", transactionAmount = 0, data = "" };
        }




        public bool IsTransactionSuccess(string transactionHash, int retryCnt = 0)
        {
            try
            {
                string url = $"https://apilist.tronscan.org/api/transaction-info?hash=" + transactionHash;

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(url);
                    //var content = new StringContent(@"{""value"":'" + transactionHash + "'}", Encoding.UTF8, "application/json");
                    var response = client.GetAsync("").GetAwaiter().GetResult();
                    var transactionResult = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();

                    var json = new JavaScriptSerializer().Deserialize<dynamic>(transactionResult);

                    return json["contractRet"].ToString() == "SUCCESS";
                }
            }
            catch (Exception ex)
            {
                if (retryCnt < 3)
                {
                    Thread.Sleep(1000);
                    retryCnt++;
                    return IsTransactionSuccess(transactionHash, retryCnt);
                }
                return false;
            }
        }

        public int IsETHTransactionSuccess(string transactionHash, int retryCnt = 0)
        {
            try
            {
                var web3 = new Web3("https://polygon-rpc.com");

                var receipt = web3.Eth.Transactions.GetTransactionReceipt.SendRequestAsync(transactionHash).GetAwaiter().GetResult();

                if (receipt != null)
                {
                    return receipt.Succeeded() ? 1 : 2;
                }
                else
                {
                    Thread.Sleep(2000);
                    return IsETHTransactionSuccess(transactionHash, retryCnt);
                }
            }
            catch (Exception ex)
            {
                if (retryCnt < 5)
                {
                    Thread.Sleep(2000);
                    retryCnt++;
                    return IsETHTransactionSuccess(transactionHash, retryCnt);
                }
                return 0;
            }
        }


        public string SendETHWithdrawal(string toAddress, decimal[] amount)
        {
            var account = new Nethereum.Web3.Accounts.Account("8849837632e5b1de41453d34248507fd7596272fdc27a7eb49d02ae7c15d762f", 137);//testnet 97  //bsc chain id 56
            var gasLimit = BigInteger.Parse(utils.GetGasLimit().ToString());
            var web3 = new Web3(account, utils.GetRPCUrl());
            var gasPrice = web3.Eth.GasPrice.SendRequestAsync().GetAwaiter().GetResult().Value * 2;
            var nonce = web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(account.Address).GetAwaiter().GetResult();
            var value = BigInteger.Parse("0");
            var polygonUsdtAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
            var abiEncode = new ABIEncode();
            var abi = abiEncode.GetABIEncoded(
                        new ABIValue("address", polygonUsdtAddress),  
                        new ABIValue("address", "0x0000000000000000000000000000000000000000"),
                        new ABIValue("address[]", new string[] { toAddress }),
                        new ABIValue("uint256[]", new BigInteger[] { Web3.Convert.ToWei(amount[0], UnitConversion.EthUnit.Ether) })).ToHex();
            var t = new TransactionInput()
            {
                From = account.Address,
                To = this.utils.GetContractAddress(),
                Value = new HexBigInteger(value),
                Gas = new HexBigInteger(gasLimit),
                GasPrice = new HexBigInteger(gasPrice),
                Nonce = nonce,
                Data = "0xd8d5acff" + abi
            };
            var txSigned = web3.Eth.TransactionManager.SignTransactionAsync(t).GetAwaiter().GetResult();
            var transaction = new Nethereum.RPC.Eth.Transactions.EthSendRawTransaction(web3.Client);
            var txnHash = transaction.SendRequestAsync(txSigned).GetAwaiter().GetResult();
            return txnHash;
        }

        public string SendMTAWithdrawal(string toAddress, decimal[] amount)
        {
            var account = new Nethereum.Web3.Accounts.Account("", 137);//testnet 97

            //var gasPrice = Web3.Convert.ToWei(utils.GetGasPrice(), UnitConversion.EthUnit.Gwei);
            var gasLimit = BigInteger.Parse(utils.GetGasLimit().ToString());

            var web3 = new Web3(account, utils.GetRPCUrl());//"https://rpc-mainnet.matic.quiknode.pro");//"https://rpc-mainnet.maticvigil.com/");//

            var gasPrice = web3.Eth.GasPrice.SendRequestAsync().GetAwaiter().GetResult().Value * 2;

            var nonce = web3.Eth.Transactions.GetTransactionCount.SendRequestAsync(account.Address).GetAwaiter().GetResult();
            var value = BigInteger.Parse("0");


            var abiEncode = new ABIEncode();
            var abi = abiEncode.GetABIEncoded(
                        new ABIValue("address", utils.GetTokenAddress()),
                        new ABIValue("address", "0x0000000000000000000000000000000000000000"),
                        new ABIValue("address[]", new string[] { toAddress }),
                        new ABIValue("uint256[]", new BigInteger[] { Web3.Convert.ToWei(amount[0], UnitConversion.EthUnit.Ether) })).ToHex();


            var t = new TransactionInput()
            {
                From = account.Address,
                To = this.utils.GetContractAddress(),
                Value = new HexBigInteger(value),
                Gas = new HexBigInteger(gasLimit),
                GasPrice = new HexBigInteger(gasPrice),
                Nonce = nonce,
                Data = "0xd8d5acff" + abi
            };


            var txSigned = web3.Eth.TransactionManager.SignTransactionAsync(t).GetAwaiter().GetResult();

            var transaction = new Nethereum.RPC.Eth.Transactions.EthSendRawTransaction(web3.Client);

            var txnHash = transaction.SendRequestAsync(txSigned).GetAwaiter().GetResult();

            return txnHash;
        }
    }
}
