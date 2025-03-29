using FXCapitalApi.Models;
using System.Data;

namespace FXCapitalApi.Repositories.Interfaces
{
    public interface IAccountRepository
    {
        DataSet CompanyDetails();
        DataSet SaveMTARate(decimal rate);
        DataSet SaveMATICRate(decimal rate);
        public DataSet Login(string address);// for blockchain 
        public DataSet LoginMLM(string UserID, string password);  // for MLM 
        DataSet EmailOrSmsDetails(int IsEmailSystem, int IsSMSSystem);
        public DataSet GetSupportedCrypto(bool UniqueChainsOnly);

        public DataSet InsertUserTransactionInfo(string SponsorUserId, string userAddress, decimal transactionAmount);

        public DataSet InsertCryptoTransactionInfo(RegistrationPayload payload, string userAddress, decimal transactionAmount);

        public DataSet Register(RegistrationPayload payload, string userAddress, decimal transactionAmount); // for blockchain \
        public DataSet SaveMemberRegistration(RegistrationPayload payload, string userAddress, decimal transactionAmount, string Hash);

        public DataSet Deposit(DepositPayload payload, string userAddress, decimal transactionAmount); // for blockchain 

        public DataSet InsertOrUpdateFirstpurchaseProduct(string description, decimal value, int byAdminId, long productId = 0);
        public DataSet RegisterMLM(string txtUserId, string txtPassword, string txtUplineId, string txtSponsorId, string rblposition, string txtName, string txtAddress, int ddlState, int ddlCountry,
            int txtPinCode, string txtMobileNo, string txtEmail, string txtBankName, string txtBranchName, string txtIFSCCode, string txtAccountNumber, string txtAccountHolderName, string txtPanNumber,
            string txtPinNumber, int txtPinPassword, string btcAddress, string ethAddress, string trxAddress, string bscAddress, string maticAddress);// for MLM 

        public DataSet UpdatePassword(string UserId, string OldPassword, string NewPassword, int UserType, bool IsByAdmin, int ByAdminId, bool IsForgotPassword);

        public DataSet IsValidPin(string FullPinNumber, int pinpassword);
        public DataSet GetUserDetails(string UserId);

        //   public DataSet RegisterShop(string txtId ,string txtUserName, string txtGmail, string txtPassword, string txtAddress);

        (bool isValid, string name, string side) GetSponsorDetails(string sponsorId);
        DataSet GetPackages();

        DataSet GetPanExists(string PanNo);
        DataSet IsEmailExists(string EmailId);
        DataSet IsMobileNoExists(string MobileNo);
    }


}
