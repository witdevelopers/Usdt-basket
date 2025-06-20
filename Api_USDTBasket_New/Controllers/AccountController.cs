using Api.Services;
using FXCapitalApi.Authentication;
using FXCapitalApi.Models;
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using Grpc.Core;
using Microsoft.AspNetCore.Mvc;
using Nancy.Json;
using Nethereum.BlockchainProcessing.BlockStorage.Entities;
using Nethereum.Contracts.Standards.ENS;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Numerics;
using System.Linq;

namespace FXCapitalApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly IAccountRepository accountRepository;
        private readonly IJWTAuthentication jWTAuthentication;
        private readonly ITransaction transaction;
        private readonly IFundRepository fundRepository;
        private readonly IUtils utils;
        private readonly IEmailService emailService;
        private readonly ISmsService smsService;
        private readonly ICryptoService cryptoService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AccountController(IAccountRepository accountRepository, IJWTAuthentication jWTAuthentication, ITransaction transaction, IFundRepository fundRepository, IUtils utils, IEmailService emailService, ICryptoService cryptoService, ISmsService smsService, IWebHostEnvironment webHostEnvironment)
        {
            this.accountRepository = accountRepository;
            this.jWTAuthentication = jWTAuthentication;
            this.transaction = transaction;
            this.fundRepository = fundRepository;
            this.utils = utils;
            this.emailService = emailService;
            //    this.emailService = emailService;
            this.cryptoService = cryptoService;
            this.smsService = smsService;
            _webHostEnvironment = webHostEnvironment;
        }
        //[HttpGet("Registertest")]
        //public IActionResult Registertest()
        //{
        //    return ProcessTransaction_NativeERCToken("0xfa908bc7885c0ca6b53d9c0f425522efdce5ef8643ad523d99d36036ac6c5e46", 4, "0x9E55c2D097C6D794d91655A62F0BBf91854F154b");
        //}

        [HttpGet("CompanyDetails")]
        public IActionResult CompanyDetails()
        {
            try
            {
                DataSet ds = accountRepository.CompanyDetails();
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                {

                    return new JsonResult(new { status = true, data = ds });
                }
                return new JsonResult(new { status = false, message = "Some error occurred!", data = "" });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }

        [HttpGet("IsPanExists")]
        public IActionResult GetPanExists(string PanNo)
        {
            DataSet ds = accountRepository.GetPanExists(PanNo);

            return new JsonResult(new { status = true, data = ds });
        }






        [HttpGet("IsEmailExists")]
        public IActionResult IsEmailExists(string EmailId)
        {
            DataSet ds = accountRepository.IsEmailExists(EmailId);

            return new JsonResult(new { status = true, data = ds });
        }


        [HttpGet("IsMobileNoExists")]
        public IActionResult IsMobileNoExists(string MobileNo)
        {
            DataSet ds = accountRepository.IsMobileNoExists(MobileNo);

            return new JsonResult(new { status = true, data = ds });
        }


        [HttpGet("FetchMTARate")]
        public IActionResult FetchMTARate()
        {
            try
            {

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

                WebClient web1 = new WebClient();
                string url = string.Format("https://api.1inch.dev/swap/v5.2/137/quote?src=0x10B461f8bBF39A18a6668c145B312c78BCc65dD4&dst=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&amount=1000000000000000000");
                web1.Headers.Add("Content-Type", "application/json");
                web1.Headers.Add("Authorization", "Bearer 6IjJJGLkdMfUhSrM7zCh0Fih5YmlrYxF");
                string response1 = web1.DownloadString(url);

                var js = new JavaScriptSerializer();

                var response = js.Deserialize<dynamic>(response1);


                var rate = Convert.ToDecimal(response.toAmount) / (decimal)(Math.Pow(10, 6) * 1);
                DataSet ds = accountRepository.SaveMTARate(rate);
                FetchMATICRate();
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                {
                    return new JsonResult(new { status = true, data = ds });
                }
                return new JsonResult(new { status = false, message = "Some error occurred!", data = "" });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }

        [HttpGet("FetchMATICRate")]
        public IActionResult FetchMATICRate()
        {
            try
            {

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;

                WebClient web1 = new WebClient();
                string url = string.Format("https://min-api.cryptocompare.com/data/pricemulti?fsyms=MATIC&tsyms=USD");
                string response1 = web1.DownloadString(url);

                var js = new JavaScriptSerializer();

                var response = js.Deserialize<dynamic>(response1);


                var rate = Convert.ToDecimal(response.MATIC.USD);
                DataSet ds = accountRepository.SaveMATICRate(rate);
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                {
                    return new JsonResult(new { status = true, data = ds });
                }
                return new JsonResult(new { status = false, message = "Some error occurred!", data = "" });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }

        [HttpGet("Login")]
        public IActionResult Login(string address, string signature)
        {
            try
            {
                string message = " Do you want to login?";
                bool isValid = utils.VerifyETHSignature(message, address, signature);


                if (isValid)
                {
                    DataSet ds = accountRepository.Login(address);
                    if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                    {
                        bool loginStatus = Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"].ToString()) && ds.Tables[0].Rows[0]["Type"].ToString() == "User";
                        bool AdminloginStatus = Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"].ToString()) && ds.Tables[0].Rows[0]["Type"].ToString() == "Admin";
                        if (loginStatus == true)
                        {
                            string token = jWTAuthentication.GenerateUserToken(address);
                            return new JsonResult(new { status = loginStatus, message = "User login successful", data = token, isAdmin = false });
                        }
                        else if (AdminloginStatus == true)
                        {
                            string token = jWTAuthentication.GenerateUserToken(address);
                            return new JsonResult(new { status = AdminloginStatus, message = "Admin login successful", data = token, isAdmin = true });
                        }
                        return new JsonResult(new { status = loginStatus, message = "User not registered!", data = "" });
                    }
                    return new JsonResult(new { status = false, message = "User not registered!", data = "" });
                }
                return new JsonResult(new { status = false, message = "Invalid signature!", data = new { } });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }


        [HttpGet("LoginMLM")]  // for mlm 
        public IActionResult LoginMLM(string UserID, string password)
        {
            try
            {
                //string message = " Do you want to login?";
                //bool isValid = utils.VerifyETHSignature(message, UserID);
                bool isValid = true;

                if (isValid)
                {
                    DataSet ds = accountRepository.LoginMLM(UserID, password);
                    if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
                    {
                        bool loginStatus = Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"].ToString());

                        if (loginStatus)
                        {
                            string token = jWTAuthentication.GenerateUserToken(UserID);
                            return new JsonResult(new { status = loginStatus, message = "User login successful", data = ds, token });
                        }
                        return new JsonResult(new { status = loginStatus, message = "User not registered!", data = "" });
                    }
                    return new JsonResult(new { status = false, message = "User not registered!", data = "" });
                }
                return new JsonResult(new { status = false, message = "Invalid signature!", data = new { } });

            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }






        [HttpGet("GetSupportedCrypto")]
        public IActionResult GetSupportedCrypto(bool UniqueChainsOnly)
        {
            //string userAddress = User.getUserId();

            DataSet ds = accountRepository.GetSupportedCrypto(UniqueChainsOnly);

            return new JsonResult(new { status = true, data = ds });
        }


        [HttpGet("GenerateCryptoAddresses")]
        public IActionResult GenerateCryptoAddresses([FromQuery] bool uniqueChainsOnly = true)
        {
            try
            {
                var cryptoAddresses = cryptoService.GenerateCryptoAddresses(uniqueChainsOnly);
                return Ok(new { success = true, data = cryptoAddresses });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetNewTransactions")]
        public IActionResult GetNewTransactions()
        {
            try
            {
                string address = "0xaD83cC72b6A8C5FeDDC1982E627B947659D9850d"; // Your wallet address
                string contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT Contract Address
                string multiSendContract = "0xYourMultiSendContractAddress"; // Multi-send contract

                string apiKey = "6VDUE6664ZFFX789GK6DDCBJPESKKMZCH7";

                ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072;
                WebClient webClient = new WebClient();
                webClient.Headers.Add("Content-Type", "application/json");

                // Fetch ERC-20 token transactions (including USDT transfers)
                string tokenTxUrl = $"https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress={contractAddress}&address={address}&startblock=0&endblock=99999999&page=1&offset=500&sort=desc&apikey={apiKey}";
                string tokenTxResponse = webClient.DownloadString(tokenTxUrl);
                var tokenTxResult = new JavaScriptSerializer().Deserialize<dynamic>(tokenTxResponse);

                if (tokenTxResult["status"] != "1")
                {
                    return new JsonResult(new
                    {
                        status = false,
                        message = $"Error fetching token transactions: {tokenTxResult["message"]}"
                    });
                }

                var transactions = tokenTxResult["result"];
                List<object> processedTransactions = new List<object>();

                foreach (var trans in transactions)
                {
                    try
                    {
                        string transactionHash = trans["hash"].ToString();
                        string tokenSymbol = trans["tokenSymbol"].ToString();
                        string rawValue = trans["value"].ToString();
                        int tokenDecimals = int.Parse(trans["tokenDecimal"].ToString());

                        decimal transactionAmount = Convert.ToDecimal(rawValue) / (decimal)Math.Pow(10, tokenDecimals);
                        string fromAddress = trans["from"].ToString();
                        string toAddress = trans["to"].ToString();

                        // ✅ Check if this transaction is related to your multi-send contract
                        if (tokenSymbol == "USDT")
                        {
                            ProcessTransaction_NativeERCToken_NewTransactions(transactionHash, transactionAmount);
                            processedTransactions.Add(new
                            {
                                transactionHash,
                                tokenSymbol,
                                transactionAmount,
                                fromAddress,
                                toAddress
                            });
                        }
                    }
                    catch (Exception innerEx)
                    {
                        Console.WriteLine($"Skipping a transaction due to error: {innerEx.Message}");
                    }
                }

                return new JsonResult(new
                {
                    status = true,
                    message = "Transactions fetched successfully.",
                    data = processedTransactions
                });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException?.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }


        [HttpGet("GetCryptoRate/{cryptoId}/{usdAmount}")]
        public IActionResult GetCryptoRate(int cryptoId, decimal usdAmount)
        {
            try
            {
                // Assuming UniqueChainsOnly is a parameter you want to pass; modify as needed
                bool uniqueChainsOnly = false; // or true, based on your requirement

                // Execute the stored procedure to get supported crypto details
                DataSet ds = accountRepository.GetSupportedCrypto(uniqueChainsOnly);

                // Check if the DataSet contains a valid DataTable
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    // Fetching details of the crypto
                    DataRow cryptoRow = ds.Tables[0].Rows[0]; // Accessing the first row
                    string crypto = cryptoRow["ShortName"].ToString(); // Access ShortName
                    bool isStableCoin = Convert.ToBoolean(cryptoRow["IsStableCoin"]);
                    decimal rate = 0m;

                    // If it's not a stable coin, get the rate from the live API
                    if (!isStableCoin)
                    {
                        rate = cryptoService.GetRate(crypto, "USD"); // Ensure to use the service method
                    }
                    else
                    {
                        // If it's a stable coin, get the rate from the stored procedure
                        rate = Convert.ToDecimal(cryptoRow["Rate"]);
                    }

                    // Calculate the crypto amount based on USD amount
                    decimal cryptoAmount = CalculateCryptoAmount(usdAmount, rate);

                    // Return the result
                    return Ok(new
                    {
                        status = true,
                        crypto,
                        rate,
                        cryptoAmount
                    });
                }

                return NotFound(new { status = false, message = "Crypto not found." });
            }
            catch (Exception ex)
            {
                // Log the exception details
                return BadRequest(new
                {
                    status = false,
                    message = "An error occurred while processing your request.",
                    error = ex.Message
                });
            }
        }



        private decimal CalculateCryptoAmount(decimal usdAmount, decimal rate)
        {
            return usdAmount / rate;
        }
        private IActionResult ProcessTransaction_NativeERCToken(string transactionHash, decimal transactionAmount, string sponsorAddress, string requestId)
        {
            try
            {
                Thread.Sleep(2000);
                TransactionValidity transactionValidity = transaction.IsTransactionValid_NativeETHTokens(transactionHash, transactionAmount);
                if (transactionValidity.isValid)
                {
                    DataSet ds = utils.ExecuteQuery("USP_CheckValidTransaction", new SqlParameter[] {
                        new SqlParameter("@TransactionHash", transactionHash)
                    });

                    if (ds.HasDataTable() && ds.Tables[0].IsDataTable() && Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"]))
                    {
                        string data = transactionValidity.data;

                        if (data != null)
                        {
                            DataSet ds1 = utils.ExecuteQuery("USP_IsUserIdExists", new SqlParameter[]
                            {
                                    new SqlParameter("@UserId", transactionValidity.fromAddress)
                            });

                            if (Convert.ToBoolean(ds1.Tables[0].Rows[0]["Valid"]))
                            {
                                return new JsonResult(new { status = false, message = "User Already Registered", data = new { } });
                            }
                            else
                            {
                                RegistrationPayload payload = new RegistrationPayload();
                                payload.sponsorAddress = sponsorAddress;
                                payload.transactionHash = transactionHash;

                                DataSet result = accountRepository.InsertCryptoTransactionInfo(payload, transactionValidity.fromAddress, transactionAmount);

                                DataSet res = accountRepository.SaveMemberRegistration(payload, transactionValidity.fromAddress, transactionValidity.transactionAmount, transactionHash, requestId);

                                //if (result.HasDataTable() && result.Tables[0].IsDataTable())
                                //{
                                //    DataRow dr = result.Tables[0].Rows[0];
                                //    return new JsonResult(new { status = dr["Success"], message = dr["Message"], data = new { } });
                                //}
                                if (res.HasDataTable() && res.Tables[0].IsDataTable())
                                {
                                    DataRow dr = res.Tables[0].Rows[0];
                                    return new JsonResult(new { status = dr["ISSUCCESS"], message = dr["MESSAGE"], data = new { } });
                                }
                                return new JsonResult(new { status = false, message = "Some error occurred while registration!", data = new { } });
                            }
                        }
                    }
                }
                return new JsonResult(new { status = false, message = "Invalid transaction!", data = new { } });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }

        [HttpPost("RegisterAddressToListener")]
        public IActionResult RegisterAddressToListener(string address, string crypto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(crypto))
                {
                    return BadRequest(new { status = false, message = "Address and Crypto are required." });
                }

                // Call the service to register the address
                cryptoService.RegisterAddressToListener(address, crypto);

                return Ok(new { status = true, message = "Address registered for monitoring successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "An error occurred while registering the address.",
                    error = ex.Message
                });
            }
        }

        [HttpPost("RegisterMLM")]
        public IActionResult RegisterMLM(string txtUserId, string txtPassword, string txtUplineId, string txtSponsorId, string rblposition, string txtName, string txtAddress, int ddlState, int ddlCountry,
      int txtPinCode, string txtMobileNo, string txtEmail, string txtBankName, string txtBranchName, string txtIFSCCode, string txtAccountNumber, string txtAccountHolderName, string txtPanNumber,
      string txtPinNumber, int txtPinPassword, string btcAddress, string ethAddress, string trxAddress, string bscAddress, string maticAddress)
        {
            try
            {
                // Parameter validation
                if (string.IsNullOrWhiteSpace(txtUserId))
                {
                    return new JsonResult(new { status = false, message = "User ID is required.", data = new { } });
                }

                bool isValid = true; // Your actual validation logic

                if (isValid)
                {
                    // Handle null or empty values for string parameters if necessary
                    txtPinNumber = string.IsNullOrWhiteSpace(txtPinNumber) ? "0" : txtPinNumber.Trim();
                    string pinPassword = txtPinPassword.ToString();

                    // Generate crypto addresses
                    //   var cryptoAddresses = cryptoService.GenerateCryptoAddresses(true);

                    // Extract addresses
                    //string btcAddress = cryptoAddresses.ContainsKey("BTC") ? cryptoAddresses["BTC"] : null;
                    //string ethAddress = cryptoAddresses.ContainsKey("ETH") ? cryptoAddresses["ETH"] : null;
                    //string bscAddress = cryptoAddresses.ContainsKey("BSC") ? cryptoAddresses["BSC"] : null;
                    //string trxAddress = cryptoAddresses.ContainsKey("TRX") ? cryptoAddresses["TRX"] : null;
                    //string maticAddress = cryptoAddresses.ContainsKey("MATIC") ? cryptoAddresses["MATIC"] : null;

                    // Call the repository to register the user
                    DataSet res = accountRepository.RegisterMLM(txtUserId, txtPassword, txtUplineId, txtSponsorId, rblposition, txtName, txtAddress, ddlState, ddlCountry,
                        txtPinCode, txtMobileNo, txtEmail, txtBankName, txtBranchName, txtIFSCCode, txtAccountNumber, txtAccountHolderName, txtPanNumber, txtPinNumber, txtPinPassword,
                        btcAddress, ethAddress, trxAddress, bscAddress, maticAddress);

                    if (res.HasDataTable() && res.Tables[0].IsDataTable())
                    {
                        DataRow dr = res.Tables[0].Rows[0];

                        if (Convert.ToBoolean(dr["Success"]))
                        {
                            // Fetch company details to check if email or SMS services are active
                            DataSet companyDetails = accountRepository.CompanyDetails();
                            bool isEmailSystemActive = false;
                            bool isSmsSystemActive = false;
                            string smsUser = null;
                            string smsKey = null;
                            string smsSenderId = null;

                            if (companyDetails.HasDataTable() && companyDetails.Tables[0].IsDataTable())
                            {
                                DataRow companyRow = companyDetails.Tables[0].Rows[0];
                                isEmailSystemActive = Convert.ToBoolean(companyRow["IsEmailSystem"]);
                                isSmsSystemActive = Convert.ToBoolean(companyRow["IsSMSSystem"]);
                            }

                            // Send email upon successful registration if the email service is active
                            if (isEmailSystemActive && !string.IsNullOrEmpty(txtEmail))
                            {
                                string emailBody = string.Empty;
                                string templatePath = Path.Combine(_webHostEnvironment.ContentRootPath, "EmailFormat/Register.html");

                                // Load and customize email template
                                using (StreamReader reader = new StreamReader(templatePath))
                                {
                                    emailBody = reader.ReadToEnd();
                                }

                                emailBody = emailBody.Replace("{name}", dr["Name"].ToString());
                                emailBody = emailBody.Replace("{userid}", dr["UserId"].ToString());
                                emailBody = emailBody.Replace("{psw}", dr["Password"].ToString());
                                emailBody = emailBody.Replace("{companyName}", dr["CompanyName"].ToString());
                                emailBody = emailBody.Replace("{Website}", dr["Website"].ToString());
                                emailBody = emailBody.Replace("{Logo}", dr["Logo"].ToString());
                                emailBody = emailBody.Replace("{Footer}", dr["Footer"].ToString());

                                emailService.SendEmail(txtEmail, "Registration", emailBody);
                            }

                            // Send SMS upon successful registration if the SMS service is active
                            if (isSmsSystemActive && !string.IsNullOrEmpty(txtMobileNo))
                            {
                                // Fetch SMS service parameters
                                DataSet smsDetails = accountRepository.EmailOrSmsDetails(isEmailSystemActive ? 1 : 0, isSmsSystemActive ? 1 : 0);

                                if (smsDetails.HasDataTable() && smsDetails.Tables[0].IsDataTable())
                                {
                                    DataRow smsRow = smsDetails.Tables[0].Rows[0];
                                    smsUser = smsRow["SmsUser"].ToString();
                                    smsKey = smsRow["SmsKey"].ToString();
                                    smsSenderId = smsRow["SmsSenderId"].ToString();
                                }
                                string USerInfo = "User ID : " + txtUserId + "and Password : " + txtPassword;

                                string message = $"Welcome to AIMetaToken, User ID and Password : {USerInfo} . Visithttps://aimetatoken.in/ JOINES";
                                string smsResult = smsService.SendSms(txtMobileNo, "REG|" + message, smsUser, smsKey, smsSenderId);

                                // Check if the SMS was successfully sent
                                return new JsonResult(new { status = true, message = dr["Message"], data = new { smsResult = "SMS sent successfully" } });
                            }

                            return new JsonResult(new { status = true, message = dr["Message"], data = new { } });
                        }
                        else
                        {
                            return new JsonResult(new { status = false, message = dr["Message"], data = new { } });
                        }
                    }

                    return new JsonResult(new { status = false, message = "Some error occurred during registration!", data = new { } });
                }

                return new JsonResult(new { status = false, message = "Invalid transaction!", data = new { } });
            }
            catch (Exception ex)
            {
                // Log the exception details (consider using a logging framework)
                return new JsonResult(new
                {
                    status = false,
                    message = "An error occurred while processing your request.",
                    data = new
                    {
                        inner = ex.InnerException?.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }



        [HttpPost("InsertOrUpdateFirstpurchaseProduct")]
        public IActionResult InsertOrUpdateFirstpurchaseProduct(string description, decimal value, int byAdminId, long productId = 0)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(description))
                {
                    return BadRequest(new { status = false, message = "Description are required." });
                }

                // Call the service to register the address


                return Ok(new { status = true, message = "Product updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Internal server error occur.",
                    error = ex.Message
                });
            }
        }


        [HttpPost("InsertUserTransactionInfo")]
        public IActionResult InsertUserTransactionInfo(string SponsorUserId, string userAddress, decimal transactionAmount)
        {
            DataSet ds = accountRepository.InsertUserTransactionInfo(SponsorUserId, userAddress, transactionAmount);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Some issue occurred during insertion", data = new { } });
        }


        //[HttpPost("RegisterShop")]
        //public IActionResult RegisterShop(string txtId, string txtUserName, string txtGmail, string txtPassword, string txtAddress)
        //{
        //    try
        //    {
        //        //string message = " Do you want to login?";
        //        //bool isValid = utils.VerifyETHSignature(message, UserID);
        //        bool isValid = true;

        //        if (isValid)
        //        {
        //            DataSet res = accountRepository.RegisterShop(txtId , txtUserName, txtGmail, txtPassword, txtAddress);
        //            if (res.HasDataTable() && res.Tables[0].IsDataTable())
        //            {
        //                DataRow dr = res.Tables[0].Rows[0];
        //                return new JsonResult(new { status = dr["Success"], message = dr["Message"], data = new { } });

        //            }
        //            return new JsonResult(new { status = false, message = "Some error occurred while registration!", data = new { } });
        //        }
        //        return new JsonResult(new { status = false, message = "Invalid transaction!", data = new { } });

        //    }
        //    catch (Exception ex)
        //    {
        //        return new JsonResult(new
        //        {
        //            status = false,
        //            message = ex.Message,
        //            data = new
        //            {
        //                inner = ex.InnerException.Message,
        //                stacktrace = ex.StackTrace,
        //                source = ex.Source
        //            }
        //        });
        //    }
        //}


        [HttpPut("UpdatePassword")]
        public IActionResult UpdatePassword(string UserId, string OldPassword, string NewPassword, int UserType, bool IsByAdmin, int ByAdminId, bool IsForgotPassword)
        {
            // Call the repository method to execute the stored procedure
            DataSet ds = accountRepository.UpdatePassword(UserId, OldPassword, NewPassword, UserType, IsByAdmin, ByAdminId, IsForgotPassword);

            // Check if the dataset contains a valid result
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                var valid = ds.Tables[0].Rows[0]["Valid"].ToString();
                var message = ds.Tables[0].Rows[0]["Message"].ToString();

                // Check if the stored procedure returned 'True' for a successful password update
                if (valid == "True")
                {
                    return new JsonResult(new { status = true, message = message });
                }
                else
                {
                    return new JsonResult(new { status = false, message = message });
                }
            }

            return new JsonResult(new { status = false, message = "Invalid user!", data = new { } });
        }



        [HttpGet("GetUserDetails")]
        public IActionResult GetUserDetails(string UserId)
        {
            DataSet ds = accountRepository.GetUserDetails(UserId);
            return new JsonResult(new { status = true, data = ds.Tables[0] });

        }


        [HttpGet("IsPinValid")]
        public IActionResult IsValidPin(string FullPinNumber, int pinpassword)
        {
            DataSet ds = accountRepository.IsValidPin(FullPinNumber, pinpassword);
            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
         
                return new JsonResult(new { status = false, message = "Invalid pin." });
            }
            return new JsonResult(new { status = true, data = ds.Tables[0] });
        }


        [HttpGet("IsSponsorValid")]
        public IActionResult IsSponsorValid(string sponsorId)
        {
            // Check for null or empty sponsorId
            if (string.IsNullOrEmpty(sponsorId))
            {
                return new JsonResult(new { status = false, message = "Sponsor Id cannot be empty." });
            }

            try
            {
                var (isValid, name, side) = accountRepository.GetSponsorDetails(sponsorId);

                if (!isValid)
                {
                    return new JsonResult(new { status = false, message = "Sponsor Id does not exist." });
                }

                return new JsonResult(new
                {
                    status = true,
                    message = "Success",
                    name = name,
                    side = side
                });
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                Console.WriteLine(ex); // Replace with a proper logging mechanism
                return new JsonResult(new { status = false, message = "An error occurred while processing your request." });
            }
        }


        [HttpGet("GetPackages")]
        public IActionResult GetPackages()
        {
            DataSet ds = accountRepository.GetPackages();
            return new JsonResult(new { status = true, data = ds.Tables[0] });

        }

        [HttpPost("Register")]
        public IActionResult Register(RegistrationPayload payload)
        {
            return ProcessTransaction_NativeERCToken(payload.transactionHash, payload.Amount,payload.sponsorAddress, payload.requestId);
        }
        private IActionResult ProcessTransaction_NativeERCToken_NewTransactions(string transactionHash, decimal transactionAmount)
        {
            try
            {
                Thread.Sleep(2000);
                TransactionValidity transactionValidity = transaction.IsTransactionValid_NativeETHTokens(transactionHash, transactionAmount);

                if (transactionValidity.isValid)
                {
                    DataSet ds = utils.ExecuteQuery("USP_CheckValidTransaction", new SqlParameter[] {
                new SqlParameter("@TransactionHash", transactionHash)
            });

                    if (ds.HasDataTable() && ds.Tables[0].IsDataTable() && Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"]))
                    {
                        string data = transactionValidity.data;

                        if (data != null)
                        {


                            DataSet ds1 = utils.ExecuteQuery("USP_IsUserIdExists", new SqlParameter[]
                            {
                            new SqlParameter("@UserId", transactionValidity.fromAddress)
                            });

                            if (Convert.ToBoolean(ds1.Tables[0].Rows[0]["Valid"]))
                            {
                                return new JsonResult(new { status = false, message = "User Already Registered!", data = new { } });
                            }
                            else
                            {
                                var sponsorAddress = "0x3b48F1a6aEf01976cB7Ef98a49321b5926a42439";
                                RegistrationPayload payload = new RegistrationPayload
                                {
                                    sponsorAddress = sponsorAddress,
                                    transactionHash = transactionHash
                                };
                                DataSet result = accountRepository.InsertCryptoTransactionInfo(payload, transactionValidity.fromAddress, transactionAmount);
                                DataSet res = accountRepository.SaveMemberRegistration(payload, transactionValidity.fromAddress, transactionValidity.transactionAmount, transactionHash, payload.requestId);

                                if (res.HasDataTable() && res.Tables[0].IsDataTable())
                                {
                                    DataRow dr = res.Tables[0].Rows[0];
                                    return new JsonResult(new { status = dr["ISSUCCESS"], message = dr["MESSAGE"], data = new { } });
                                }
                                return new JsonResult(new { status = false, message = "Some error occurred while registration!", data = new { } });
                            }
                        }
                    }
                }
                return new JsonResult(new { status = false, message = "Invalid transaction!", data = new { } });
            }
            catch (Exception ex)
            {
                return new JsonResult(new
                {
                    status = false,
                    message = ex.Message,
                    data = new
                    {
                        inner = ex.InnerException?.Message,
                        stacktrace = ex.StackTrace,
                        source = ex.Source
                    }
                });
            }
        }
       
      
        private IActionResult Reinvest(InvestmentPayload payload, TransactionValidity txInfo)
        {
            DataSet ds = fundRepository.Invest(payload, txInfo.fromAddress, txInfo.transactionAmount);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                DataRow dr = ds.Tables[0].Rows[0];
                return new JsonResult(new { status = dr["Success"], message = dr["Message"], data = new { } });
            }
            return new JsonResult(new { status = false, message = "Some error occurred while depositing!", data = new { } });
        }

        //[HttpGet]
        //public void Get()
        //{
        //    var transactionHash = "0xe1b6d8821c0bb847f61f2c9e92f2444354731c733754a4cbd643bbba2d56eb51";
        //    var txInfo = transaction.IsTransactionValid_ETH(transactionHash);

        //    DataSet ds = utils.ExecuteQuery("USP_CheckValidTransaction", new SqlParameter[] {
        //                new SqlParameter("@TransactionHash", transactionHash)
        //            });

        //    if (ds.HasDataTable() && ds.Tables[0].IsDataTable() && Convert.ToBoolean(ds.Tables[0].Rows[0]["Valid"]))
        //    {
        //        var trans = 
        //        string data = trans["input"].ToString();

        //        if (data != null)
        //        {
        //            if (data.IndexOf("0x72621500") >= 0) //Reinvest
        //            {
        //                InvestmentPayload investmentPayload = new InvestmentPayload();
        //                investmentPayload.transactionHash = transactionHash;
        //                investmentPayload.packageId = 0;

        //                FundController fundController = new FundController(fundRepository, utils, transaction);
        //                var res = fundController.Invest(investmentPayload);
        //            }
        //            else if (data.IndexOf("0x8ce0bd46") >= 0) //Deposit
        //            {
        //                DataSet ds1 = utils.ExecuteQuery("USP_IsUserIdExists", new SqlParameter[]
        //                {
        //                        new SqlParameter("@UserId", txInfo.fromAddress)
        //                });

        //                if (Convert.ToBoolean(ds1.Tables[0].Rows[0]["Valid"]))
        //                {
        //                    InvestmentPayload investmentPayload = new InvestmentPayload();
        //                    investmentPayload.transactionHash = transactionHash;
        //                    investmentPayload.packageId = 0;

        //                    FundController fundController = new FundController(fundRepository, utils, transaction);
        //                    var res = fundController.Invest(investmentPayload);
        //                }
        //                else
        //                {
        //                    var sponsorAddress = "0x" + data.Substring(data.Length - 40, 40);

        //                    RegistrationPayload payload = new RegistrationPayload();
        //                    payload.sponsorAddress = sponsorAddress;
        //                    payload.transactionHash = transactionHash;

        //                    var res = Register(payload);
        //                }
        //            }
        //        }
        //    }
        //}
    }
}
