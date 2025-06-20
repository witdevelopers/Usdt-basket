using FXCapitalApi.Repositories.Interfaces;
using Google.Type;
using System.Collections.Generic;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net.Mail;
using Api.Shop.Models;

namespace FXCapitalApi.Repositories
{
    public class UserHomeRepository : IUserHomeRepository
    {
        private readonly IUtils utils;

        public UserHomeRepository(IUtils utils)
        {
            this.utils = utils;
        }

        public DataSet DashboardDetails(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetUserDashboardDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }


        public DataSet AdminDashboardDetails()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetAdminDashboardDetails", new SqlParameter[]
            {
            });
            return ds;
        }


        public DataSet EditProfile(string userId, string txtFirstName, string txtAddress, string txtDistrict, int ddlState, int ddlCountry, string txtPinCode, string txtMobile, string txtEmail, string txtPanNo)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdateUserDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@FirstName", txtFirstName),
                new SqlParameter("@Address", txtAddress),
                new SqlParameter("@District", txtDistrict),
                new SqlParameter("@State", ddlState),
                new SqlParameter("@Country", ddlCountry),
                new SqlParameter("@Pincode", txtPinCode),
                new SqlParameter("@MobileNo", txtMobile),
                new SqlParameter("@EmailId", txtEmail),
                new SqlParameter("@PanNo", txtPanNo)
            });
            return ds;
        }

        public DataSet UpdateBankDetails(string userId, string BankName, string BranchName, string AccountNo, string IFSCode, string AccountHolderName)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdateBankDetails", new SqlParameter[]
          {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@BankName", BankName),
                new SqlParameter("@BranchName", BranchName),
                new SqlParameter("@AccountNo", AccountNo),
                new SqlParameter("@IFSCode", IFSCode),
                new SqlParameter("@AccountHolderName", AccountHolderName)

          });
            return ds;
        }

        public DataSet BlockUnblockUserStatus(int memberId, int isByAdmin)
        {
            DataSet ds = utils.ExecuteQuery("USP_BlockUnblockUser", new SqlParameter[]
          {
                new SqlParameter("@MemberId", memberId),
                new SqlParameter("@ByAdminId", isByAdmin),


          });
            return ds;
        }

        public DataSet BlockUnblockROI(int pinSrno, int ByAdmin)
        {
            DataSet ds = utils.ExecuteQuery("USP_BlockUnblockROI_Pin", new SqlParameter[]
          {
                new SqlParameter("@PinSrno", pinSrno),
                new SqlParameter("@ByAdminId", ByAdmin),


          });
            return ds;
        }

        public DataSet UserSearch(string userId, string name, string mobileNo, int topupStatus, int blockedStatus, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetUserSearch", new SqlParameter[]
          {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Name", name),
                new SqlParameter("@MobileNoOrEmailId", mobileNo),
                new SqlParameter("@TopupStatus", topupStatus),
                new SqlParameter("@BlockedStatus", blockedStatus),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)

          });
            return ds;
        }

        public DataSet InsertKYC(string userId, string PancardNo, string PanName, string AadhaarNo, string AadhaarName)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertKYCRequest", new SqlParameter[]
          {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@AadharCardNo", AadhaarNo),
                new SqlParameter("@AadharCardName", AadhaarName),
                new SqlParameter("@PanCardNo", PancardNo),
                new SqlParameter("@PanCardName", PanName)

          });
            return ds;
        }

        public DataSet GetKYC(string userId, int type)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetKYCRequests", new SqlParameter[]
          {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Type", type)

          });
            return ds;
        }
        public DataSet ApproveRejectKYC(string RequestId, string status)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetKYCRequests", new SqlParameter[]
          {
                new SqlParameter("@RequestId", RequestId),
                new SqlParameter("@Status", status)

          });
            return ds;
        }


        public DataSet GetROIIncomeDetails(string UserId, string Fromdate, string Todate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetROILevelIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId),
                new SqlParameter("@Fromdate", Fromdate),
                new SqlParameter("@Todate", Todate)


            });

            return ds;
        }


        public DataSet GetUserCryptoDeposits(string UserId, string Crypto)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetUserCryptoDeposits", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId),
                new SqlParameter("@Crypto", @Crypto)

            });

            return ds;
        }

        public DataSet UpdateWithdrawalAddresses(string UserId, string BTCAddress, string ETHAddress, string TRXAddress, string BSCAddress, string MATICAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdateMemberWithdrawalCryptoAddresses", new SqlParameter[]{
            new SqlParameter("@UserId", UserId),
            new SqlParameter("@BTCAddress", BTCAddress),
            new SqlParameter("@ETHAddress",ETHAddress ),
            new SqlParameter("@TRXAddress",TRXAddress),
            new SqlParameter("@BSCAddress",BSCAddress),
            new SqlParameter("@MATICAddress",MATICAddress)
        });
            return ds;
        }


        public DataSet GeneratePins(string UserId, long ByMemberOrAdminId, bool IsByAdmin, int NoOfPins, int PackageId, string Remarks)
        {
            DataSet ds = utils.ExecuteQuery("USP_GeneratePins", new SqlParameter[]{
            new SqlParameter("@UserId", UserId),
            new SqlParameter("@ByMemberOrAdminId", ByMemberOrAdminId),
            new SqlParameter("@IsByAdmin",IsByAdmin ),
            new SqlParameter("@NoOfPins",NoOfPins ),
            new SqlParameter("@PackageId",PackageId),
            new SqlParameter("@Remarks",Remarks)
        });
            return ds;

        }


        public DataSet InsertOrUpdateFirstpurchaseProduct(string Description, decimal Value, int ByAdminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertOrUpdateFirstpurchaseProduct", new SqlParameter[]{
            new SqlParameter("@Description", Description),
            new SqlParameter("@Value", Value),
            new SqlParameter("@ByAdminId",ByAdminId ),
        });
            return ds;

        }

        public DataSet GetFirstpurchaseProduct()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetFirstpurchaseProduct", new SqlParameter[]{

        });
            return ds;

        }


        public DataSet CreditDebitAmount_Wallet(string UserId, int WalletType, string Type, decimal Amount, string Remarks, int ByAdminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_CreditDebitAmount_Wallet", new SqlParameter[]{
            new SqlParameter("@UserId", UserId),
            new SqlParameter("@WalletType", WalletType),
            new SqlParameter("@Type", Type),
            new SqlParameter("@Amount", Amount),
            new SqlParameter("@Remarks", Remarks),
            new SqlParameter("@ByAdminId", UserId),

        });
            return ds;
        }

        public DataSet DeletePin(string pinNumber, string pinPassword, int AdminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_DeleteUnusedPin", new SqlParameter[]
            {
          new SqlParameter("@PinNumber", pinNumber),
          new SqlParameter("@PinPassword", pinPassword),
          new SqlParameter("@ByAdminId", AdminId),
            });
            return ds;
        }

        public DataSet DirectDetails(string userID, string fromDate, string toDate, int status, int side)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetDirects", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate),
                new SqlParameter("@Status", status),
                new SqlParameter("@Side", side)
            });
            return ds;
        }
        public DataSet DirectTree(string userID)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetDirectTree", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID)
            });
            return ds;
        }

    public DataSet PoolTree(string userID)
    {
      DataSet ds = utils.ExecuteQuery("SP_Tree_new", new SqlParameter[]
      {
                new SqlParameter("@user", userID)
      });
      return ds;
    }
    public DataSet BinaryTree(string userID, string SponsoruserID)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetBinaryTree_Old", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@SponsorUserId", SponsoruserID)
            });
            return ds;
        }

        public DataSet BinaryIncome(string userID, int PayoutNo)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetBinaryIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo)
            });
            return ds;
        }


        public DataSet SpillIncome(string userID, string Fromdate, string Todate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetSpillIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", Fromdate),
                 new SqlParameter("@Todate", Todate)
            });
            return ds;
        }


        public DataSet TeamDetails(string userID, string fromDate, string toDate, int level, int side, int PageIndex, int PageSize)
        {
            DataSet ds = utils.ExecuteQuery("USP_Genealogy", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate),
                new SqlParameter("@Level", level),
                new SqlParameter("@Side", side),
                new SqlParameter("@PageIndex", PageIndex),
                new SqlParameter("@PageSize", PageSize)

            });
            return ds;
        }


        public DataSet PinDetails(string userID, string fromDate, string toDate, string type, int? status, string allottedOrTransferred, string pinNumber)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetAllottedPin_s", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate),
                new SqlParameter("@Type", type),
                new SqlParameter("@Status", status),
               new SqlParameter("@AllottedOrTransferred", allottedOrTransferred),
               new SqlParameter("@PinNumber", pinNumber),

            });
            return ds;
        }

        public DataSet PinTransfer(string userID, string ToUserId, int PackageId, int NoOfPinsToTransfer, bool IsByAdmin, int ByAdminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertTransferPinDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@ToUserId", ToUserId),
                new SqlParameter("@PackageId", PackageId),
                new SqlParameter("@NoOfPinsToTransfer", NoOfPinsToTransfer),
                new SqlParameter("@IsByAdmin", IsByAdmin),
               new SqlParameter("@ByAdminId", ByAdminId)


            });
            return ds;
        }

        public DataSet PinAvailableQty(string userID, int PackageId)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetNoOfPinsAvailable", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PackageId", PackageId)

            });
            return ds;
        }

        public DataSet PinTransferDetails(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetPinTransferDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)


            });
            return ds;
        }


        public DataSet GetPinRequestDetails(string userID, string fromDate, string toDate, int AllotStatus, int RequestId)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetPinRequestDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate),
                new SqlParameter("@AllotStatus", AllotStatus),
                new SqlParameter("@RequestId", RequestId)


            });
            return ds;
        }

        public DataSet PinStatistics(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetPinStatistics", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)


            });
            return ds;
        }


        public DataSet BusinessCountDetails(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetBusinessCountDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }
        public DataSet Topup(string userID, int packid, decimal pinValue, bool IsByAdmin, string ByUserOrAdminUserId, string paymentMode, int walletID)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertTopupDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PackageId", packid),
                new SqlParameter("@PinValue", pinValue),
                new SqlParameter("@IsByAdmin", IsByAdmin),
                new SqlParameter("@ByUserOrAdminUserId", ByUserOrAdminUserId),
                new SqlParameter("@PaymentMode", paymentMode),
                new SqlParameter("@WalletId", walletID)
            });
            return ds;
        }
        public DataSet TopupByPin(string userID, string PinNumber, int PinPassword, int ByMemberId, int ByUserType)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertTopupDetails_EPin", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PinNumber", PinNumber),
                new SqlParameter("@PinPassword", PinPassword),
                new SqlParameter("@ByMemberId", ByMemberId),
                new SqlParameter("@ByUserType", ByUserType)
            });
            return ds;
        }
        public DataSet TopupDetails(string userID, string topupBy, string userIdForDownlineTopup, string fromDate, string toDate, string type, int pageindex, int pagesize)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTopupDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@TopupBy", topupBy),
                new SqlParameter("@UserIdForDownlineTopup", userIdForDownlineTopup),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate),
                new SqlParameter("@Type", type),
                new SqlParameter("@pageindex", pageindex),
                new SqlParameter("@pagesize", pagesize)
            });
            return ds;
        }

        public DataSet DeleteTopUp(int Pinsrno, int ByadminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_DeleteTopup", new SqlParameter[]
           {
                new SqlParameter("@Pinsrno", Pinsrno),
                new SqlParameter("@ByAdminId", ByadminId)

           });
            return ds;
        }

        public DataSet GetTopupPackages(int IsAdmin, string PackageType)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTopupPackages", new SqlParameter[]
            {
                new SqlParameter("@IsAdmin", IsAdmin),
                new SqlParameter("@PackageType", PackageType)



            });
            return ds;
        }



        public DataSet ROI(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetROIIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }
        public DataSet GetDirectIncome(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetDirectIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }
        public DataSet GetLevelIncome(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetSponsoredincome", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID)
            });
            return ds;
        }


        public DataSet GetDailyStepRankIncome(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetLevelIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }


        public DataSet GetOneTimeStepRankIncome(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetLevelIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }

        public DataSet GetLeaderShipBonusesThroughDirects(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetLeaderShipBonusesThroughDirects", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }
        public DataSet GetTeamBusinessBonus(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTeamBusinessBonus", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }

        public DataSet GetAdventureLifeBonus(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTeamBusinessBonus", new SqlParameter[]
            {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }



        public DataSet GetTotalPayouts_Daily()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTotalPayouts_Daily", new SqlParameter[]
          {
          });
            return ds;
        }


        public DataSet GetTotalPayouts()
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTotalPayouts", new SqlParameter[]
          {
          });
            return ds;
        }


        public DataSet GetTotalIncomeDetailsDaily(string userID, int PayoutNo)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTotalIncomeDetails_Daily", new SqlParameter[]
          {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo),

          });
            return ds;
        }

        public DataSet GetTotalIncomeDetails(string userID, int PayoutNo, int? Type)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTotalIncomeDetails", new SqlParameter[]
          {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo),
                new SqlParameter("@Type", Type),

          });
            return ds;
        }


        public DataSet GetTotalIncomeDetailsWithPagination(string userID, int PayoutNo, int? Type, decimal amount, int PageIndex, int PageSize)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetTotalIncomeDetails_Test", new SqlParameter[]
          {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo),
                new SqlParameter("@amount", amount),
                new SqlParameter("@PageIndex", PageIndex),
                new SqlParameter("@PageSize", PageSize),
                new SqlParameter("@Type", Type),

          });
            return ds;
        }


        public DataSet UpdatePayoutPayment_Daily(string userID, int PayoutNo, decimal Amount)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdatePayoutPayment_Daily", new SqlParameter[]
        {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo),
                new SqlParameter("@Amount", Amount),

        });
            return ds;

        }

        public DataSet UpdatePayoutPayment_Total(string userID, int PayoutNo, decimal Amount)
        {
            DataSet ds = utils.ExecuteQuery("USP_UpdatePayoutPayment_Total", new SqlParameter[]
        {
                new SqlParameter("@UserId", userID),
                new SqlParameter("@PayoutNo", PayoutNo),
                new SqlParameter("@Amount", Amount),

        });
            return ds;

        }

        public DataSet ApproveRejectInvestmentRequest(DataTable approveRejectRequestDetails, int status, int adminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_ApproveRejectInvestmentRequest", new SqlParameter[]
            {
          new SqlParameter("@ApproveRejectRequestDetails", approveRejectRequestDetails),
          new SqlParameter("@Status", status),
          new SqlParameter("@AdminId", adminId)
            });
            return ds;
        }

        public DataSet GetRequestsForInvestment(string userID, string fromDate, string toDate, int status)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetRequestsForInvestment", new SqlParameter[]
            {
         new SqlParameter("@UserId", userID),
         new SqlParameter("@Fromdate", fromDate),
         new SqlParameter("@Todate", toDate),
         new SqlParameter("@Status", status)

            });
            return ds;
        }

        public DataSet GetRequestsForWithdrawlAdminSide(string userID, string fromDate, string toDate, int status)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetRequestsForWithdrawal", new SqlParameter[]
            {
         new SqlParameter("@UserId", userID),
         new SqlParameter("@Fromdate", fromDate),
         new SqlParameter("@Todate", toDate),
         new SqlParameter("@Status", status)

            });
            return ds;
        }

        public DataSet ApproveRejectWithdrawlRequestAdminSide(DataTable approveRejectRequestDetails, int status, int adminId)
        {
            DataSet ds = utils.ExecuteQuery("USP_ApproveRejectWithdrawalRequest", new SqlParameter[]
            {
          new SqlParameter("@ApproveRejectRequestDetails", approveRejectRequestDetails),
          new SqlParameter("@Status", status),
          new SqlParameter("@AdminId", adminId)
            });
            return ds;
        }

        public DataSet GetWithdrawalLevelIncome_APR(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetWithdrawalLevelIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet GetPOIIncome(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetPOIIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }



        public DataSet GetSalaryIncome(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetSalaryIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet GetEORIncome(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetEORIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet GetBoardPools(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetPools", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet GetMatrixEntries(string userAddress, int poolId)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetMatrixEntries", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress),
                new SqlParameter("@PoolId", poolId)
            });
            return ds;
        }

        public DataSet GetMatrixCount(int entryId, int poolId)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetMatrixCount", new SqlParameter[]
            {
                new SqlParameter("@EntryId", entryId),
                new SqlParameter("@PoolId", poolId)
            });
            return ds;
        }

        public DataSet GetMatrixIncome(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetMatrixIncome", new SqlParameter[]
            {
               new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }

        public DataSet GetLeaderShipIncomeDetails(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetLeaderShipIncomeDetails", new SqlParameter[]
            {
               new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }

        public DataSet GetSingleLegIncomeDetails(string userID, string fromDate, string toDate)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetSingleLegIncomeDetails", new SqlParameter[]
            {
               new SqlParameter("@UserId", userID),
                new SqlParameter("@Fromdate", fromDate),
                new SqlParameter("@Todate", toDate)
            });
            return ds;
        }

        public DataSet GetVIPIncome(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetVIPIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet GetAllIncomepool(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetAllIncomepool", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

        public DataSet royaltyincome(string userId)
        {
            DataSet ds = utils.ExecuteQuery("USP_royaltyincome", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId)
            });
            return ds;
        }
        //public DataSet Directincome(string userId)
        //{
        //    DataSet ds = utils.ExecuteQuery("USP_Directincome", new SqlParameter[]
        //    {
        //        new SqlParameter("@UserId", userId)
        //    });
        //    return ds;
        //}
        public DataSet clubincome(string userId)
        {
            DataSet ds = utils.ExecuteQuery("USP_clubincome", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId)
            });
            return ds;
        }

        public DataSet INSERTINTOtblPoolGUser(string userId, int Pool)
        {
            DataSet ds = utils.ExecuteQuery("USP_INSERT_INTO_tblPool_G_user", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Pool", Pool)
            });
            return ds;
        }

        public DataSet NextPool(string UserId)
        {
            DataSet ds = utils.ExecuteQuery("USP_NextPool", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId)
            });
            return ds;
        }

        public DataSet CheckForPoolUpgrade(string UserId)
        {
            DataSet ds = utils.ExecuteQuery("USP_checksponsortopup", new SqlParameter[]
            {
                new SqlParameter("@UserId", UserId)
            });
            return ds;
        }

    public DataSet CheckSponsor_new(string UserId)
    {
      DataSet ds = utils.ExecuteQuery("USP_CheckSponsor_new", new SqlParameter[]
      {
                new SqlParameter("@UserId", UserId)
      });
      return ds;
    }

    public DataSet GetMiningIncome(string userAddress)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetROIIncomeDetails", new SqlParameter[]
            {
                new SqlParameter("@UserId", userAddress)
            });
            return ds;
        }

    public DataSet GetLevelIncomeDetailsMatrix(string userID, string fromDate, string toDate)
    {
      DataSet ds = utils.ExecuteQuery("USP_GetLevelIncomeDetailsMatrix", new SqlParameter[]
      {
         new SqlParameter("@UserId", userID),
         new SqlParameter("@Fromdate", fromDate),
         new SqlParameter("@Todate", toDate)

      });
      return ds;
    }







  }
}
