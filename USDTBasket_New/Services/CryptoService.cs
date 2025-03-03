using FXCapitalApi.Repositories.Interfaces;
using IpData.Models;
using Nancy.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;

namespace Api.Services
{
    public class CryptoService : ICryptoService
    {
        private readonly IAccountRepository _accountRepository; // Use IAccountRepository instead of AccountRepository
        private readonly HttpClient _httpClient;

        public CryptoService(IAccountRepository accountRepository, HttpClient httpClient)
        {
            _accountRepository = accountRepository;
            _httpClient = httpClient;
        }

        public Dictionary<string, string> GenerateCryptoAddresses(bool uniqueChainsOnly)
        {
            Dictionary<string, string> cryptoAddresses = new Dictionary<string, string>();
            DataSet ds = _accountRepository.GetSupportedCrypto(uniqueChainsOnly);

            if (Utilities.DataTableExtensions.HasDataTable(ds) && Utilities.DataTableExtensions.IsDataTable(ds.Tables[0]))
            {
                string cryptos = "";

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    cryptos += dr["Chain"].ToString() + ",";
                }

                cryptos = cryptos.TrimEnd(',');

                if (!string.IsNullOrEmpty(cryptos))
                {
                    string apiUrl = string.Format("{0}api/Accounts/CreateAccount?chains={1}&appKey={2}",
                        Utilities.DataTableExtensions.blockchainApi,
                        cryptos,
                        Utilities.DataTableExtensions.appKey);

                    //  Console.WriteLine("API URL: " + apiUrl); // Log the URL to check it

                    try
                    {
                        var response = _httpClient.GetStringAsync(apiUrl).Result;
                        var js = new JavaScriptSerializer();
                        var jsonResponse = js.Deserialize<dynamic>(response);

                        if (Convert.ToBoolean(jsonResponse["success"]))
                        {
                            var data = jsonResponse["data"];

                            if (cryptos.Contains("BTC"))
                                cryptoAddresses["BTC"] = data["BTC"].ToString();

                            if (cryptos.Contains("ETH"))
                                cryptoAddresses["ETH"] = data["ETH"].ToString();

                            if (cryptos.Contains("BSC"))
                                cryptoAddresses["BSC"] = data["BSC"].ToString();

                            if (cryptos.Contains("TRX"))
                                cryptoAddresses["TRX"] = data["TRX"].ToString();

                            if (cryptos.Contains("MATIC"))
                                cryptoAddresses["MATIC"] = data["MATIC"].ToString();
                        }
                        else
                        {
                            throw new Exception(jsonResponse["message"].ToString());
                        }
                    }
                    catch (HttpRequestException httpRequestException)
                    {
                        Console.WriteLine($"Request error: {httpRequestException.Message}");
                        throw; // Optionally rethrow or handle
                    }
                }
            }

            return cryptoAddresses;
        }
        public decimal GetRate(string crypto, string toCurrency)
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

            WebClient web = new WebClient();
            string url = string.Format(Utilities.DataTableExtensions.blockchainApi + "api/CoinsLiveRate/GetRate?fromCurrencies=" + crypto + "&toCurrencies=" + toCurrency);
            string response1 = web.DownloadString(url);

            var js = new JavaScriptSerializer();
            var d = js.Deserialize<dynamic>(response1);

            if (d["message"] == "OK")
            {
                var val = d["data"][crypto][toCurrency];
                return Convert.ToDecimal(val);
            }
            else
            {
                return 0m; // Handle this case appropriately
            }
        }


        public decimal CalculateCryptoAmount(decimal usdAmount, string crypto)
        {
            decimal rate = GetRate(crypto, "USD");
            if (rate > 0)
            {
                return usdAmount / rate; // Calculate crypto amount
            }
            else
            {
                throw new Exception("Invalid crypto rate.");
            }
        }

        public void RegisterAddressToListener(string address, string crypto)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(address))
                {
                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

                    WebClient web = new WebClient();
                    
                string url = string.Format(Utilities.DataTableExtensions.blockchainApi + "api/Listener/RegisterAddressToListener?address=" + address + "&crypto=" + crypto + "&hours=3");
                    string response = web.DownloadString(url);
                    // You may want to log the response or process it if needed
                }
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw new ApplicationException("Error registering address to listener.", ex);
            }
        }
    }
}
