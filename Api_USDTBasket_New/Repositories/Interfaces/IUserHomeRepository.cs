using System;
using System.Data;

namespace FXCapitalApi.Repositories.Interfaces
{
    public interface IUserHomeRepository
    {
        DataSet DashboardDetails(string userAddress);
        DataSet AdminDashboardDetails();
        DataSet EditProfile(string userId, string txtFirstName, string txtAddress, string txtDistrict, int ddlState, int ddlCountry, string txtPinCode, string txtMobile, string txtEmail, string txtPanNo);
        DataSet UpdateBankDetails(string userId, string BankName, string BranchName, string AccountNo, string IFSCode, string AccountHolderName);
        DataSet BlockUnblockUserStatus(int memberId, int isByAdmin);
        DataSet BlockUnblockROI(int pinSrno, int ByAdmin);
        DataSet UserSearch(string userId, string name, string mobileNo, int topupStatus, int blockedStatus, string fromDate, string toDate);
        DataSet InsertKYC(string userId, string PancardNo, string PanName, string AadhaarNo, string AadhaarName);
        DataSet GetKYC(string userId, int type);
        DataSet ApproveRejectKYC(string RequestId, string status);
        DataSet GetROIIncomeDetails(string UserId, string Fromdate, string Todate);
        DataSet DirectDetails(string userID, string fromDate, string toDate, int status, int side);
        DataSet DirectTree(string userID);
        DataSet BinaryTree(string userID, string SponsoruserID);
        DataSet BinaryIncome(string userID, int PayoutNo);
        DataSet SpillIncome(string userID, string Fromdate, string Todate);
        DataSet TeamDetails(string userID, string fromDate, string toDate, int level, int side, int PageIndex, int PageSize);
        DataSet BusinessCountDetails(string userID, string fromDate, string toDate);
        DataSet GetBoardPools(string userAddress);
        DataSet GetMatrixEntries(string userAddress, int poolId);
        DataSet GetMatrixCount(int entryId, int poolId);

        DataSet PinTransfer(string userID, string ToUserId, int PackageId, int NoOfPinsToTransfer, bool IsByAdmin, int ByAdminId);
        DataSet PinTransferDetails(string userID, string fromDate, string toDate);
        DataSet PinAvailableQty(string userID, int packid);
        DataSet PinStatistics(string userID, string fromDate, string toDate);
        DataSet GetPinRequestDetails(string userID, string fromDate, string toDate, int AllotStatus, int RequestId);
        DataSet PinDetails(string userID, string fromDate, string toDate, string type, int? status, string allottedOrTransferred, string pinNumber);
        DataSet Topup(string userID, int packid, decimal pinValue, bool IsByAdmin, string ByUserOrAdminUserId, string paymentMode, int walletID);
        DataSet TopupByPin(string userID, string PinNumber, int PinPassword, int ByMemberId, int ByUserType);
        DataSet TopupDetails(string userID, string topupBy, string userIdForDownlineTopup, string fromDate, string toDate, string type, int pageindex, int pagesize);

        DataSet DeleteTopUp(int Pinsrno, int ByadminId);
        DataSet GetTopupPackages(int IsAdmin, string PackageType);

        DataSet GetUserCryptoDeposits(string UserId, string Crypto);

        DataSet UpdateWithdrawalAddresses(string UserId, string BTCAddress, string ETHAddress, string TRXAddress, string BSCAddress, string MATICAddress);

        DataSet GeneratePins(string UserId, long ByMemberOrAdminId, bool IsByAdmin, int NoOfPins, int PackageId, string Remarks);

        DataSet InsertOrUpdateFirstpurchaseProduct(string Description, decimal Value, int ByAdminId);
        DataSet GetFirstpurchaseProduct();
        DataSet CreditDebitAmount_Wallet(string UserId, int WalletType, string Type, decimal Amount, string Remarks, int ByAdminId);
        DataSet DeletePin(string pinNumber, string pinPassword, int AdminId);
        DataSet GetDirectIncome(string userID, string fromDate, string toDate);
        DataSet GetLevelIncome(string userID, string fromDate, string toDate);

        DataSet GetDailyStepRankIncome(string userID, string fromDate, string toDate);
        DataSet GetOneTimeStepRankIncome(string userID, string fromDate, string toDate);

        DataSet GetLeaderShipBonusesThroughDirects(string userID, string fromDate, string toDate);

        DataSet GetTeamBusinessBonus(string userID, string fromDate, string toDate);

        DataSet GetAdventureLifeBonus(string userID, string fromDate, string toDate);

        DataSet GetTotalPayouts_Daily();
        DataSet GetTotalPayouts();

        DataSet GetTotalIncomeDetailsDaily(string userID, int PayoutNo);
        DataSet GetTotalIncomeDetails(string userID, int PayoutNo, int? Type);
        DataSet GetTotalIncomeDetailsWithPagination(string userID, int PayoutNo, int? Type, decimal amount, int PageIndex, int PageSize);

        DataSet UpdatePayoutPayment_Daily(string userID, int PayoutNo, decimal Amount);

        DataSet UpdatePayoutPayment_Total(string userID, int PayoutNo, decimal Amount);
        DataSet ApproveRejectInvestmentRequest(DataTable approveRejectRequestDetails, int status, int adminId);

        DataSet GetRequestsForInvestment(string userID, string fromDate, string toDate, int status);

        DataSet GetRequestsForWithdrawlAdminSide(string userID, string fromDate, string toDate, int status);

        DataSet ApproveRejectWithdrawlRequestAdminSide(DataTable approveRejectRequestDetails, int status, int adminId);
        DataSet ROI(string userID, string fromDate, string toDate);
        DataSet GetMatrixIncome(string userID, string fromDate, string toDate);

        DataSet GetLeaderShipIncomeDetails(string userID, string fromDate, string toDate);
        DataSet GetSingleLegIncomeDetails(string userID, string fromDate, string toDate);
        DataSet GetWithdrawalLevelIncome_APR(string userAddress);
        DataSet GetPOIIncome(string userAddress);
        DataSet GetSalaryIncome(string userAddress);
        DataSet GetEORIncome(string userAddress);
        DataSet GetVIPIncome(string userAddress);
        DataSet GetMiningIncome(string userAddress);
        DataSet GetAllIncomepool(string userId);
        DataSet royaltyincome(string userId);
        //DataSet Directincome(string userId);
        DataSet clubincome(string userId);
        DataSet INSERTINTOtblPoolGUser(string UserId,int Pool);
        DataSet NextPool(string UserId);
        DataSet CheckForPoolUpgrade(string UserId);
    }
}
