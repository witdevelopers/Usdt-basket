using FXCapitalApi.Models;
using FXCapitalApi.Repositories.Interfaces;
using Nethereum.BlockchainProcessing.BlockStorage.Entities.Mapping;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;

namespace FXCapitalApi.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly IUtils utils;

        public AccountRepository(IUtils _utils)
        {
            utils = _utils;
        }

        public DataSet CompanyDetails()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetCompanyDetails");

            return ds;
        }

        public DataSet GetPanExists(string PanNo)
        {
            DataSet ds = utils.ExecuteQuery("USP_IsPanNoExists", new SqlParameter[]
           {
                new SqlParameter("@PanNo", PanNo),

           });
            return ds;
        }

        public DataSet EmailOrSmsDetails(int IsEmailSystem, int IsSMSSystem)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetEmailDetails", new SqlParameter[]
           {
                new SqlParameter("@IsEmailSystem", IsEmailSystem),
                new SqlParameter("@IsSMSSystem", IsSMSSystem),


           });
            return ds;
        }



        public DataSet IsEmailExists(string EmailId)
        {
            DataSet ds = utils.ExecuteQuery("USP_IsEmailIdExists", new SqlParameter[]
           {
                new SqlParameter("@EmailId", EmailId),

           });
            return ds;
        }
        public DataSet IsMobileNoExists(string MobileNo)
        {
            DataSet ds = utils.ExecuteQuery("USP_IsMobileNoExists", new SqlParameter[]
           {
                new SqlParameter("@MobileNo", MobileNo),

           });
            return ds;
        }

        public DataSet SaveMTARate(decimal rate)
        {
            DataSet ds = utils.ExecuteQuery("USP_SaveMTARate", new SqlParameter[] {
                new SqlParameter("@Rate", rate)
            });

            return ds;
        }

        public DataSet SaveMATICRate(decimal rate)
        {
            DataSet ds = utils.ExecuteQuery("USP_SaveMaticRate", new SqlParameter[] {
                new SqlParameter("@Rate", rate)
            });

            return ds;
        }

        public DataSet Login(string address)  // for blockchain 
        {
            DataSet ds = utils.ExecuteQuery("USP_Login", new SqlParameter[]
            {
                new SqlParameter("@UserId", address)
            });

            return ds;
        }


        public DataSet Register(RegistrationPayload payload, string userAddress, decimal transactionAmount) // for blockchain 
        {
            DataSet ds = utils.ExecuteQuery("USP_Registration", new SqlParameter[] {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@SponsorUserId", payload.sponsorAddress),
                new SqlParameter("@TransactionHash", payload.transactionHash),
                new SqlParameter("@TransactionAmount", transactionAmount)
            });

            return ds;
        }

        public DataSet InsertUserTransactionInfo(string SponsorUserId, string userAddress, decimal transactionAmount)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertUserTransactionInfo", new SqlParameter[] {
                new SqlParameter("@UserId", userAddress),
                 new SqlParameter("@SponsorUserId", SponsorUserId),
                new SqlParameter("@Amount", transactionAmount)
            });

            return ds;
        }

        public DataSet InsertCryptoTransactionInfo(RegistrationPayload payload, string userAddress, decimal transactionAmount)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertCryptoTransactionInfo", new SqlParameter[] {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@TransactionHash", payload.transactionHash),
                new SqlParameter("@Amount", transactionAmount)
            });

            return ds;
        }
        public DataSet SaveMemberRegistration(RegistrationPayload payload, string userAddress, decimal transactionAmount) // for blockchain 
        {
            DataSet ds = utils.ExecuteQuery("USP_SaveMemberRegistration", new SqlParameter[] {
                new SqlParameter("@address", userAddress),
                new SqlParameter("@SPONSORID", payload.sponsorAddress),
            });

            return ds;
        }

        public DataSet Deposit(DepositPayload payload, string userAddress, decimal transactionAmount)
        {
            DataSet ds = utils.ExecuteQuery("USP_MemberDeposit_Cash", new SqlParameter[] {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@TransactionHash", payload.transactionHash),
                new SqlParameter("@TransactionAmount", transactionAmount)
            });

            return ds;
        }

        public DataSet InsertOrUpdateFirstpurchaseProduct(string description, decimal value, int byAdminId, long productId = 0) // for blockchain 
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertOrUpdateFirstpurchaseProduct", new SqlParameter[] {
                new SqlParameter("@Description", description),
                new SqlParameter("@Value", value),
                new SqlParameter("@ByAdminId", byAdminId),
                new SqlParameter("@ProductId", productId)
            });

            return ds;
        }



        public DataSet LoginMLM(string UserID, string password)   // for MLM 
        {
            DataSet ds = utils.ExecuteQuery("USP_Login", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserID),
                new SqlParameter("@Password", password),
                new SqlParameter("@IpAddress", ""),
                new SqlParameter("@URL", "")
            });

            return ds;
        }

        public DataSet GetSupportedCrypto(bool UniqueChainsOnly)   // for MLM 
        {
            DataSet ds = utils.ExecuteQuery("USP_GetSupportedCrypto", new SqlParameter[]
            {
                new SqlParameter("@UniqueChainsOnly", UniqueChainsOnly)
               
            });

            return ds;
        }

      


        // for MLM 
        public DataSet RegisterMLM(string txtUserId, string txtPassword, string txtUplineId, string txtSponsorId, string rblposition, string txtName, string txtAddress, int ddlState, int ddlCountry,
            int txtPinCode, string txtMobileNo, string txtEmail, string txtBankName, string txtBranchName, string txtIFSCCode, string txtAccountNumber, string txtAccountHolderName, string txtPanNumber,
            string txtPinNumber, int txtPinPassword , string btcAddress , string ethAddress ,string trxAddress , string bscAddress , string maticAddress)
        {
            // Check for null parameters
            if (txtUserId == null) Console.WriteLine("txtUserId is null");
            if (txtPassword == null) Console.WriteLine("txtPassword is null");
            if (txtUplineId == null) Console.WriteLine("txtUplineId is null");
            if (txtSponsorId == null) Console.WriteLine("txtSponsorId is null");
            if (rblposition == null) Console.WriteLine("rblposition is null");
            if (txtName == null) Console.WriteLine("txtName is null");
            if (txtAddress == null) Console.WriteLine("txtAddress is null");
            if (txtMobileNo == null) Console.WriteLine("txtMobileNo is null");
            if (txtEmail == null) Console.WriteLine("txtEmail is null");
            if (txtBankName == null) Console.WriteLine("txtBankName is null");
            if (txtBranchName == null) Console.WriteLine("txtBranchName is null");
            if (txtIFSCCode == null) Console.WriteLine("txtIFSCCode is null");
            if (txtAccountNumber == null) Console.WriteLine("txtAccountNumber is null");
            if (txtAccountHolderName == null) Console.WriteLine("txtAccountHolderName is null");
            if (txtPanNumber == null) Console.WriteLine("txtPanNumber is null");
            if (txtPinNumber == null) Console.WriteLine("txtPinNumber is null");
            if (btcAddress == null) Console.WriteLine("btcAddress is null");
            if (ethAddress == null) Console.WriteLine("ethAddress is null");
            if (trxAddress == null) Console.WriteLine("trxAddress is null");
            if (bscAddress == null) Console.WriteLine("bscAddress is null");
            if (maticAddress == null) Console.WriteLine("maticAddress is null");

            // Adjust PinNumber and PinPassword
            SqlParameter pinNumberParam = new SqlParameter("@PinNumber", string.IsNullOrEmpty(txtPinNumber) ? "0" : txtPinNumber.Trim());
            SqlParameter pinPasswordParam = new SqlParameter("@PinPassword", txtPinPassword == 0 ? "0" : txtPinPassword.ToString());

            DataSet ds = utils.ExecuteQuery("USP_Registration", new SqlParameter[] {
        new SqlParameter("@UserId", txtUserId ?? (object)DBNull.Value),
        new SqlParameter("@Password", txtPassword ?? (object)DBNull.Value),
        new SqlParameter("@UplineUserId", txtUplineId ?? (object)DBNull.Value),
        new SqlParameter("@SponsorUserId", txtSponsorId ?? (object)DBNull.Value),
        new SqlParameter("@Side", rblposition ?? (object)DBNull.Value),
        new SqlParameter("@FirstName", txtName ?? (object)DBNull.Value),
        new SqlParameter("@Address", txtAddress ?? (object)DBNull.Value),
        new SqlParameter("@State", ddlState),
        new SqlParameter("@Country", ddlCountry),
        new SqlParameter("@Pincode", txtPinCode),
        new SqlParameter("@MobileNo", txtMobileNo ?? (object)DBNull.Value),
        new SqlParameter("@EmailId", txtEmail ?? (object)DBNull.Value),
        new SqlParameter("@BankName", txtBankName ?? (object)DBNull.Value),
        new SqlParameter("@BranchName", txtBranchName ?? (object)DBNull.Value),
        new SqlParameter("@IFSCode", txtIFSCCode ?? (object)DBNull.Value),
        new SqlParameter("@BankAccountNo", txtAccountNumber ?? (object)DBNull.Value),
        new SqlParameter("@AccountHolderName", txtAccountHolderName ?? (object)DBNull.Value),
        new SqlParameter("@PanCardNo", txtPanNumber ?? (object)DBNull.Value),
          new SqlParameter("@DepositBTCAddress", btcAddress ?? (object)DBNull.Value),
                new SqlParameter("@DepositETHAddress", ethAddress ?? (object)DBNull.Value),
                new SqlParameter("@DepositTRXAddress", trxAddress ??(object) DBNull.Value),
                new SqlParameter("@DepositBSCAddress", bscAddress ??(object) DBNull.Value),
                new SqlParameter("@DepositMATICAddress", maticAddress ??(object) DBNull.Value),
        pinNumberParam,
        pinPasswordParam
    });

            return ds;
        }

        public DataSet GetUserDetails(string UserId) // for blockchain 
        {
            DataSet ds = utils.ExecuteQuery("USP_GetUserDetails", new SqlParameter[] {
                new SqlParameter("@UserId", UserId),

            });

            return ds;
        }

        public DataSet UpdatePassword(string UserId, string OldPassword, string NewPassword, int UserType, bool IsByAdmin, int ByAdminId, bool IsForgotPassword)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdatePassword", new SqlParameter[] {
                new SqlParameter("@UserId", UserId),
                new SqlParameter("@OldPassword", OldPassword),
                new SqlParameter("@NewPassword", NewPassword),
                new SqlParameter("@UserType", UserType),
                new SqlParameter("@IsByAdmin", IsByAdmin),
                new SqlParameter("@ByAdminId", ByAdminId),
                new SqlParameter("@IsForgotPassword", IsForgotPassword),

            });

            return ds;
        }


        public DataSet IsValidPin(string FullPinNumber, int pinpassword)
        {
            DataSet ds = utils.ExecuteQuery("USP_IsValidPin", new SqlParameter[] {
                new SqlParameter("@FullPinNumber", FullPinNumber),
                new SqlParameter("@PinPassword", pinpassword),
                

            });

            return ds;
        }

        //public DataSet RegisterShop(string txtId, string txtUserName, string txtGmail, string txtPassword, string txtAddress)
        //{
        //    DataSet ds = utils.ExecuteQuery("USP_ShopRegistration", new SqlParameter[]
        //    {
        //        new SqlParameter("@UserId",txtId.ToString()),
        //        new SqlParameter("@Name",txtUserName.ToString()),
        //        new SqlParameter("@Gmail",txtGmail.ToString()),
        //        new SqlParameter("@Password",txtPassword.ToString()),
        //        new SqlParameter("@address",txtAddress.ToString()),
        //    });

        //    return ds;
        //}


        public (bool isValid, string name, string side) GetSponsorDetails(string sponsorId)
        {
            // Check if the sponsorId is null or empty
            if (string.IsNullOrEmpty(sponsorId))
            {
                return (false, null, null); // Return false if the sponsorId is invalid
            }

            try
            {
                // Execute the stored procedure to check if the sponsor exists
                DataSet ds = utils.ExecuteQuery("USP_IsSponsorExists", new SqlParameter[] {
            new SqlParameter("@SponsorUserId", sponsorId)
        });

                // Check if the dataset contains valid data
                if (ds.HasDataTable() && ds.Tables[0].IsDataTable() && ds.Tables[0].Rows.Count > 0)
                {
                    var row = ds.Tables[0].Rows[0];
                    bool isValid = Convert.ToBoolean(row["Valid"]);
                    string name = row["Name"]?.ToString(); // Use null-conditional operator
                    string side = row["Side"]?.ToString(); // Use null-conditional operator
                    return (isValid, name, side);
                }
            }
            catch (SqlException ex)
            {
                // Log the SQL exception (consider using a logging framework)
                Console.WriteLine($"SQL Exception: {ex.Message}");
                // Handle SQL exceptions appropriately, e.g., set isValid to false
            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"Exception: {ex.Message}");
                // Handle general exceptions appropriately
            }

            return (false, null, null); // Return false if no valid data is found or an error occurred
        }

        public DataSet GetPackages()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTopupPackages");

            return ds;
        }

    }
}
