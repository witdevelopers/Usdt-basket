using FXCapitalApi.Authentication;
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using Google.Type;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Bcpg;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Helpers;
using TronNet.Protocol;

namespace FXCapitalApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserHomeController : Controller
    {
        private readonly IUserHomeRepository userHome;
        private readonly IJWTAuthentication jWTAuthentication;

        public UserHomeController(IUserHomeRepository userHome, IJWTAuthentication jWTAuthentication)
        {
            this.userHome = userHome;
            this.jWTAuthentication = jWTAuthentication;
        }

        [HttpGet("UserDashboardDetails")]
        public IActionResult DashboardDetails(string userId)
        {
            // string userAddress = User.getUserId();

            DataSet ds = userHome.DashboardDetails(userId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Invalid !", data = new { } });
        }

        [HttpGet("AdminDashboardDetails")]
        public IActionResult AdminDashboardDetails()
        {
            string userAddress = User.getUserId();

            DataSet ds = userHome.AdminDashboardDetails();

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }

        [HttpGet("UserSearch")]
        public IActionResult UserSearch(string userId, string name, string mobileNo, int topupStatus, int blockedStatus, string fromDate, string toDate)
        {
            DataSet ds = userHome.UserSearch(userId, name, mobileNo, topupStatus, blockedStatus, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }

        [HttpPost("EditProfile")]
        public IActionResult EditProfile(string userId, string txtFirstName, string txtAddress, string txtDistrict, int ddlState, int ddlCountry, string txtPinCode, string txtMobile, string txtEmail, string txtPanNo)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.EditProfile(userId, txtFirstName, txtAddress, txtDistrict, ddlState, ddlCountry, txtPinCode, txtMobile, txtEmail, txtPanNo);


            return new JsonResult(new { status = true, message = "Ok !", data = new { } });
        }


        [HttpPost("UpdateBankDetails")]
        public IActionResult UpdateBankDetails(string userId, string BankName, string BranchName, string AccountNo, string IFSCode, string AccountHolderName)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.UpdateBankDetails(userId, BankName, BranchName, AccountNo, IFSCode, AccountHolderName);
            return new JsonResult(new { status = true, message = "Ok !", data = new { } });
        }


        [HttpPost("BlockUnblockUserStatus")]
        public IActionResult BlockUnblockUserStatus(int memberId, int isByAdmin)
        {
            // Call the method to block/unblock the user
            DataSet ds = userHome.BlockUnblockUserStatus(memberId, isByAdmin);

            // Check if the operation was successful
            if (ds != null && ds.Tables.Count > 0)
            {
                // Assuming the first table indicates success; adjust based on your actual logic
                return new JsonResult(new { status = true, message = "User blocked/unblocked successfully!", data = ds });
            }
            else
            {
                return new JsonResult(new { status = false, message = "Error occurred while saving data user.", data = ds });
            }
        }

        [HttpPost("BlockUnblockROI")]
        public IActionResult BlockUnblockROI(int pinSrno, int ByAdmin)
        {
            // Call the method to block/unblock the user
            DataSet ds = userHome.BlockUnblockROI(pinSrno, ByAdmin);

            // Check if the operation was successful
            if (ds != null && ds.Tables.Count > 0)
            {
                // Assuming the first table indicates success; adjust based on your actual logic
                return new JsonResult(new { status = true, data = ds });
            }
            else
            {
                return new JsonResult(new { status = false, message = "Data Not Found", data = ds });
            }
        }




        [HttpGet("InsertKYC")]
        public IActionResult InsertKYC(string userId, string PancardNo, string PanName, string AadhaarNo, string AadhaarName)
        {
            DataSet ds = userHome.InsertKYC(userId, PancardNo, PanName, AadhaarNo, AadhaarName);

            return new JsonResult(new { status = true, data = ds });
        }

        [HttpGet("GetKYC")]
        public IActionResult GetKYC(string userId, int type)
        {
            DataSet ds = userHome.GetKYC(userId, type);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

        [HttpGet("ApproveRejectKYC")]
        public IActionResult ApproveRejectKYC(string RequestId, string status)
        {
            DataSet ds = userHome.ApproveRejectKYC(RequestId, status);

            return new JsonResult(new { status = true, data = ds });
        }

        [HttpGet("GetROILevelIncomeDetails")]
        public IActionResult GetROIIncomeDetails(string UserId, string Fromdate, string Todate)
        {
            DataSet ds = userHome.GetROIIncomeDetails(UserId, Fromdate, Todate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }

        [HttpGet("GetDailyStepRankIncome")]
        public IActionResult GetDailyStepRankIncome(string UserId, string Fromdate, string Todate)
        {
            DataSet ds = userHome.GetDailyStepRankIncome(UserId, Fromdate, Todate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }

        [HttpGet("GetOneTimeStepRankIncome")]
        public IActionResult GetOneTimeStepRankIncome(string UserId, string Fromdate, string Todate)
        {
            DataSet ds = userHome.GetOneTimeStepRankIncome(UserId, Fromdate, Todate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }


        [HttpGet("GetLeaderShipBonusesThroughDirects")]
        public IActionResult GetLeaderShipBonusesThroughDirects(string userID, string fromDate, string toDate)
        {
            DataSet ds = userHome.GetLeaderShipBonusesThroughDirects(userID, fromDate, toDate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }



        [HttpGet("GetTeamBusinessBonus")]
        public IActionResult GetTeamBusinessBonus(string userID, string fromDate, string toDate)
        {
            DataSet ds = userHome.GetTeamBusinessBonus(userID, fromDate, toDate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }


        [HttpGet("GetAdventureLifeBonus")]
        public IActionResult GetAdventureLifeBonus(string userID, string fromDate, string toDate)
        {
            DataSet ds = userHome.GetAdventureLifeBonus(userID, fromDate, toDate);

            // Check if the operation was successful
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data Found!", data = new { } });
        }

        [HttpGet("GetUserCryptoDeposits")]
        public IActionResult GetUserCryptoDeposits(string UserId, string Crypto)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.GetUserCryptoDeposits(UserId, Crypto);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }


        [HttpGet("UpdateWithdrawalAddresses")]
        public IActionResult UpdateWithdrawalAddresses(string UserId, string BTCAddress, string ETHAddress, string TRXAddress, string BSCAddress, string MATICAddress)
        {
            DataSet ds = userHome.UpdateWithdrawalAddresses(UserId, BTCAddress, ETHAddress, TRXAddress, BSCAddress, MATICAddress);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Invalid !", data = new { } });
        }

        [HttpGet("DirectDetails")]
        public IActionResult DirectDetails(string userID, string fromDate, string toDate, int status, int side)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.DirectDetails(userID, fromDate, toDate, status, side);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

        [HttpGet("DirectTree")]
        public IActionResult DirectTree(string userID)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.DirectTree(userID);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

        [HttpGet("BinaryTree")]
        public IActionResult BinaryTree(string userID, string SponsoruserID)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.BinaryTree(userID, SponsoruserID);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

    [HttpGet("PoolTree")]
    public IActionResult PoolTree(string userID)
    {
      //string userAddress = User.getUserId();
      DataSet ds = userHome.PoolTree(userID);

      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, data = ds });
        return res;
      }
      return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
    }


    [HttpGet("BinaryIncome")]
        public IActionResult BinaryIncome(string userID, int PayoutNo)
        {
            try
            {
                // Call the stored procedure and get the result in a DataSet
                DataSet ds = userHome.BinaryIncome(userID, PayoutNo);

                // Check if the DataSet has any data (optional)
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    // Return success response if data is available
                    return new JsonResult(new { status = true, data = ds });
                }
                else
                {
                    // Return a response indicating no data was found
                    return new JsonResult(new { status = false, message = "No data found", data = ds });
                }
            }
            catch (SqlException ex)
            {
                // Check if the exception message matches the custom error 'User not found'
                if (ex.Message.Contains("User not found"))
                {
                    // Return a specific error response when the user is not found
                    return new JsonResult(new { status = false, message = "User not found" });
                }
                else
                {
                    // Log the exception if necessary and return a general error response
                    return new JsonResult(new { status = false, message = "An error occurred", error = ex.Message });
                }
            }
        }

        [HttpGet("SpillIncome")]
        public IActionResult SpillIncome(string userID, string Fromdate, string Todate)
        {
            try
            {
                // Call the stored procedure and get the result in a DataSet
                DataSet ds = userHome.SpillIncome(userID, Fromdate, Todate);

                // Check if the DataSet has any data (optional)
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    // Return success response if data is available
                    return new JsonResult(new { status = true, data = ds });
                }
                else
                {
                    // Return a response indicating no data was found
                    return new JsonResult(new { status = false, message = "No data found", data = ds });
                }
            }
            catch (SqlException ex)
            {
                // Check if the exception message matches the custom error 'User not found'
                if (ex.Message.Contains("User not found"))
                {
                    // Return a specific error response when the user is not found
                    return new JsonResult(new { status = false, message = "User not found" });
                }
                else
                {
                    // Log the exception if necessary and return a general error response
                    return new JsonResult(new { status = false, message = "An error occurred", error = ex.Message });
                }
            }
        }

        [HttpGet("TeamDetails")]
        public IActionResult TeamDetails(string userID, string fromDate, string toDate, int level, int side, int PageIndex, int PageSize)
        {
            DataSet ds = userHome.TeamDetails(userID, fromDate, toDate, level, side, PageIndex, PageSize);

            // Check if the DataSet has tables
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("BusinessCountDetails")]
        public IActionResult BusinessCountDetails(string userID, string fromDate, string toDate)
        {
            DataSet ds = userHome.BusinessCountDetails(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });

        }



        [HttpGet("GetBoardPools")]
        public IActionResult GetBoardPools()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetBoardPools(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetMatrixEntries")]
        public IActionResult GetMatrixEntries(int poolId)
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetMatrixEntries(userAddress, poolId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetMatrixCount")]
        public IActionResult GetMatrixCount(int entryId, int poolId)
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetMatrixCount(entryId, poolId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("Topup")]
        public IActionResult Topup(string userID, int packid, decimal pinValue, bool IsByAdmin, string ByUserOrAdminUserId, string paymentMode, int walletID)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.Topup(userID, packid, pinValue, IsByAdmin, ByUserOrAdminUserId, paymentMode, walletID);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }

        [HttpGet("TopupByPin")]
        public IActionResult TopupByPin(string userID, string PinNumber, int PinPassword, int ByMemberId, int ByUserType)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.TopupByPin(userID, PinNumber, PinPassword, ByMemberId, ByUserType);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }




        [HttpGet("TopupDetails")]
        public IActionResult TopupDetails(string userID, string topupBy, string userIdForDownlineTopup, string fromDate, string toDate, string type, int pageindex, int pagesize)
        {
            // Fetch data from the stored procedure
            DataSet ds = userHome.TopupDetails(userID, topupBy, userIdForDownlineTopup, fromDate, toDate, type, pageindex, pagesize);


            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Data Not Found", data = new { } });
        }


        [HttpGet("GetTopupPackage")]
        public IActionResult GetTopupPackages(int IsAdmin, string PackageType)
        {
            //string userID = User.getUserId();

            DataSet ds = userHome.GetTopupPackages(IsAdmin, PackageType);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpDelete("DeleteTopUp")]
        public IActionResult DeleteTopUp(int Pinsrno, int ByadminId)
        {
            // Call to get pin details based on the parameters, including status
            DataSet ds = userHome.DeleteTopUp(Pinsrno, ByadminId);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                return new JsonResult(new { status = true, data = ds });
            }

            // Return response when no data is found or deletion failed
            return new JsonResult(new { status = false, data = ds });
        }

        [HttpGet("pin-details")]
        public IActionResult PinDetails(string userID, string fromDate, string toDate, string type, int? status, string allottedOrTransferred, string pinNumber)
        {
            // Check for valid userID, fromDate, and toDate if necessary
            // string userAddress = User.getUserId(); // Uncomment if needed

            // Call to get pin details based on the parameters, including status
            DataSet ds = userHome.PinDetails(userID, fromDate, toDate, type, status, allottedOrTransferred, pinNumber);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            // Return response when no data is found
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("Generate-pin")]
        public IActionResult GeneratePins(string UserId, long ByMemberOrAdminId, bool IsByAdmin, int NoOfPins, int PackageId, string Remarks)
        {
            DataSet ds = userHome.GeneratePins(UserId, ByMemberOrAdminId, IsByAdmin, NoOfPins, PackageId, Remarks);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            // Return response when no data is found
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("InsertOrUpdateFirstpurchaseProduct")]
        public IActionResult InsertOrUpdateFirstpurchaseProduct(string Description, decimal Value, int ByAdminId)
        {
            DataSet ds = userHome.InsertOrUpdateFirstpurchaseProduct(Description, Value, ByAdminId);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            // Return response when no data is found
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("GetFirstpurchaseProduct")]
        public IActionResult GetFirstpurchaseProduct()
        {
            DataSet ds = userHome.GetFirstpurchaseProduct();

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            // Return response when no data is found
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("CreditDebitAmount_Wallet")]
        public IActionResult CreditDebitAmount_Wallet(string UserId, int WalletType, string Type, decimal Amount, string Remarks, int ByAdminId)
        {
            DataSet ds = userHome.CreditDebitAmount_Wallet(UserId, WalletType, Type, Amount, Remarks, ByAdminId);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            // Return response when no data is found
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpDelete("DeletePin")]
        public IActionResult DeletePin([FromQuery] string pinNumber, [FromQuery] string pinPassword, [FromQuery] int AdminId)
        {
            // Call to get pin details based on the parameters, including status
            DataSet ds = userHome.DeletePin(pinNumber, pinPassword, AdminId);

            // Check if the dataset contains data
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                // Return success response with data
                return new JsonResult(new { status = true, message = "Pin deleted successfully!" });
            }

            // Return response when no data is found or deletion failed
            return new JsonResult(new { status = false, message = "Pin not found or could not be deleted.", data = new { } });
        }

        [HttpPost("PinTransfer")]
        public IActionResult PinTransfer(string userID, string ToUserId, int PackageId, int NoOfPinsToTransfer, bool IsByAdmin, int ByAdminId)
        {
            //string userAddress = User.getUserId();

            DataSet ds = userHome.PinTransfer(userID, ToUserId, PackageId, NoOfPinsToTransfer, IsByAdmin, ByAdminId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "Invalid!", data = new { } });
        }

        [HttpGet("PinTransferDetails")]
        public IActionResult PinTransferDetails(string userID, string fromDate, string toDate)
        {
            //string userID = User.getUserId();

            DataSet ds = userHome.PinTransferDetails(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("PinStatistics")]
        public IActionResult PinStatistics(string userID, string fromDate, string toDate)
        {
            //string userID = User.getUserId();

            DataSet ds = userHome.PinStatistics(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetPinRequestDetails")]
        public IActionResult GetPinRequestDetails(string userID, string fromDate, string toDate, int AllotStatus, int RequestId)
        {
            //string userID = User.getUserId();

            DataSet ds = userHome.GetPinRequestDetails(userID, fromDate, toDate, AllotStatus, RequestId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("PinAvailableQty")]
        public IActionResult PinAvailableQty(string userID, int packid)
        {
            DataSet ds = userHome.PinAvailableQty(userID, packid);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("ROI")]
        public IActionResult ROI(string userID, string fromDate, string toDate)
        {
            //string userID = User.getUserId();

            DataSet ds = userHome.ROI(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetDirectIncome")]
        public IActionResult GetDirectIncome(string userID, string fromDate, string toDate)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetDirectIncome(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetLevelIncome")]
        public IActionResult GetLevelIncome(string userID, string fromDate, string toDate)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetLevelIncome(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetTotalIncomeDetailsDaily")]
        public IActionResult GetTotalIncomeDetailsDaily(string userID, int PayoutNo)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetTotalIncomeDetailsDaily(userID, PayoutNo);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetTotalPayouts_Daily")]
        public IActionResult GetTotalPayouts_Daily()
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetTotalPayouts_Daily();

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetTotalPayouts")]
        public IActionResult GetTotalPayouts()
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetTotalPayouts();

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetTotalIncomeDetails")]
        public IActionResult GetTotalIncomeDetails(string userID, int PayoutNo, int? Type)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetTotalIncomeDetails(userID, PayoutNo, Type);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("GetTotalIncomeDetailsWithPagination")]
        public IActionResult GetTotalIncomeDetailsWithPagination(string userID, int PayoutNo, int? Type, decimal amount, int PageIndex, int PageSize)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.GetTotalIncomeDetailsWithPagination(userID, PayoutNo, Type, amount, PageIndex, PageSize);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }



        [HttpPut("UpdatePayoutPayment_Daily")]
        public IActionResult UpdatePayoutPayment_Daily(string userID, int PayoutNo, decimal Amount)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.UpdatePayoutPayment_Daily(userID, PayoutNo, Amount);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpPut("UpdatePayoutPayment_Total")]
        public IActionResult UpdatePayoutPayment_Total(string userID, int PayoutNo, decimal Amount)
        {
            //string userID = User.getUserId();
            DataSet ds = userHome.UpdatePayoutPayment_Total(userID, PayoutNo, Amount);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpPost("ApproveRejectRequest")]
        public IActionResult ApproveRejectRequest([FromBody] ApproveRejectRequestModel model)
        {
            try
            {
                // Convert the list to DataTable for the stored procedure
                DataTable approveRejectRequestDetails = new DataTable();
                approveRejectRequestDetails.Columns.Add("RequestId", typeof(long));
                approveRejectRequestDetails.Columns.Add("AdminRemarks", typeof(string));

                foreach (var item in model.ApproveRejectRequestDetails)
                {
                    approveRejectRequestDetails.Rows.Add(item.RequestId, item.AdminRemarks);
                }

                // Call repository method
                DataSet result = userHome.ApproveRejectInvestmentRequest(approveRejectRequestDetails, model.Status, model.AdminId);

                if (result != null && result.Tables.Count > 0 && result.Tables[0].Rows.Count > 0)
                {
                    return Ok(new
                    {
                        Success = result.Tables[0].Rows[0]["Success"].ToString(),
                        Message = result.Tables[0].Rows[0]["Message"].ToString()
                    });
                }

                return BadRequest(new { Success = "False", Message = "An error occurred." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = "False", Message = ex.Message });
            }
        }

        public class ApproveRejectRequestModel
        {
            public List<ApproveRejectRequestDetail> ApproveRejectRequestDetails { get; set; }
            public int Status { get; set; }
            public int AdminId { get; set; }
        }

        public class ApproveRejectRequestDetail
        {
            public long RequestId { get; set; }
            public string AdminRemarks { get; set; }
        }


        [HttpGet("GetRequestsForInvestment")]
        public IActionResult GetRequestsForInvestment(string userID, string fromDate, string toDate, int status)
        {
            // string userAddress = User.getUserId();

            DataSet ds = userHome.GetRequestsForInvestment(userID, fromDate, toDate, status);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No Data found !", data = new { } });
        }



        [HttpGet("GetRequestsForWithdrawlAdminSide")]
        public IActionResult GetRequestsForWithdrawlAdminSide(string userID, string fromDate, string toDate, int status)
        {
            // string userAddress = User.getUserId();

            DataSet ds = userHome.GetRequestsForWithdrawlAdminSide(userID, fromDate, toDate, status);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No Data found !", data = new { } });
        }

        [HttpPost("ApproveRejectRequestWithdrawl")]
        public IActionResult ApproveRejectRequestWithdrawl([FromBody] ApproveRejectRequestModelWithdrawl model)
        {
            try
            {
                // Validate the model and required properties
                if (model == null || model.ApproveRejectRequestDetails == null || model.ApproveRejectRequestDetails.Count == 0)
                {
                    return BadRequest(new { Success = "False", Message = "Request data is invalid or incomplete." });
                }

                // Convert the list to DataTable for the stored procedure
                DataTable approveRejectRequestDetails = new DataTable();
                approveRejectRequestDetails.Columns.Add("RequestId", typeof(long));
                approveRejectRequestDetails.Columns.Add("AdminRemarks", typeof(string));

                foreach (var item in model.ApproveRejectRequestDetails)
                {
                    approveRejectRequestDetails.Rows.Add(item.RequestId, item.AdminRemarks);
                }

                // Call repository method
                DataSet result = userHome.ApproveRejectWithdrawlRequestAdminSide(approveRejectRequestDetails, model.Status, model.AdminId);

                if (result != null && result.Tables.Count > 0 && result.Tables[0].Rows.Count > 0)
                {
                    return Ok(new
                    {
                        Success = result.Tables[0].Rows[0]["Success"].ToString(),
                        Message = result.Tables[0].Rows[0]["Message"].ToString()
                    });
                }

                return BadRequest(new { Success = "False", Message = "An error occurred during processing." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = "False", Message = "Internal server error.", Error = ex.Message });
            }
        }

        public class ApproveRejectRequestModelWithdrawl
        {
            public List<ApproveRejectRequestDetailWithdrawl> ApproveRejectRequestDetails { get; set; }
            public int Status { get; set; }
            public int AdminId { get; set; }
        }

        public class ApproveRejectRequestDetailWithdrawl
        {
            public long RequestId { get; set; }
            public string AdminRemarks { get; set; }
        }




        [HttpGet("GetMatrixIncome")]
        public IActionResult GetMatrixIncome(string userID, string fromDate, string toDate)
        {
            //string userAddress = User.getUserId();
            DataSet ds = userHome.GetMatrixIncome(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetSingleLegIncomeDetails")]
        public IActionResult GetSingleLegIncomeDetails(string userID, string fromDate, string toDate)
        {
            //string userAddress = User.getUserId();
            DataSet ds = userHome.GetSingleLegIncomeDetails(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetLeaderShipIncomeDetails")]
        public IActionResult GetLeaderShipIncomeDetails(string userID, string fromDate, string toDate)
        {
            //string userAddress = User.getUserId();
            DataSet ds = userHome.GetLeaderShipIncomeDetails(userID, fromDate, toDate);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }


        [HttpGet("GetWithdrawalLevelIncome_APR")]
        public IActionResult GetWithdrawalLevelIncome_APR()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetWithdrawalLevelIncome_APR(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetPOIIncome")]
        public IActionResult GetPOIIncome()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetPOIIncome(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetSalaryIncome")]
        public IActionResult GetSalaryIncome()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetSalaryIncome(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetEORIncome")]
        public IActionResult GetEORIncome()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetEORIncome(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetMiningIncome")]
        public IActionResult GetMiningIncome()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetMiningIncome(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetVIPIncome")]
        public IActionResult GetVIPIncome()
        {
            string userAddress = User.getUserId();
            DataSet ds = userHome.GetVIPIncome(userAddress);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("GetAllIncomepool")]
        public IActionResult GetAllIncomepool(string UserId)
        {
           // string userAddress = User.getUserId();
            DataSet ds = userHome.GetAllIncomepool(UserId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpGet("Getroyaltyincome")]
        public IActionResult royaltyincome(string userId)
        {
            // string userAddress = User.getUserId();
            DataSet ds = userHome.royaltyincome(userId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        //[HttpGet("GetDirectincome")]
        //public IActionResult Directincome(string userId)
        //{
        //    // string userAddress = User.getUserId();
        //    DataSet ds = userHome.Directincome(userId);

        //    if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
        //    {
        //        var res = new JsonResult(new { status = true, data = ds });
        //        return res;
        //    }
        //    return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        //}

        [HttpGet("GetClubincome")]
        public IActionResult clubincome(string userId)
        {
            // string userAddress = User.getUserId();
            DataSet ds = userHome.clubincome(userId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

        [HttpPost("INSERTINTOtblPoolGUser")]
        public IActionResult INSERTINTOtblPoolGUser(string userId, int Pool)
        {
           
            DataSet ds = userHome.INSERTINTOtblPoolGUser(userId, Pool);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, data = new { } });
        }

        [HttpPost("NextPool")]
        public IActionResult NextPool(string UserId)
        {
            DataSet ds = userHome.NextPool(UserId);
            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }
            return new JsonResult(new { status = false, data = new { } });
        }

        [HttpGet("CheckForPoolUpgrade")]
        public IActionResult CheckForPoolUpgrade(string userId)
        {
            // string userAddress = User.getUserId();
            DataSet ds = userHome.CheckForPoolUpgrade(userId);

            if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
            {
                var res = new JsonResult(new { status = true, data = ds });
                return res;
            }

            return new JsonResult(new { status = false, message = "No data found!", data = new { } });
        }

    [HttpGet("CheckSponsor_new")]
    public IActionResult CheckSponsor_new(string userId)
    {
      // string userAddress = User.getUserId();
      DataSet ds = userHome.CheckSponsor_new(userId);

      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, data = ds });
        return res;
      }

      return new JsonResult(new { status = false, message = "No data found!", data = new { } });
    }

    [HttpGet("GetLevelIncomeDetailsMatrix")]
    public IActionResult GetLevelIncomeDetailsMatrix(string userID, string fromDate, string toDate)
    {
      //string userAddress = User.getUserId();
      DataSet ds = userHome.GetLevelIncomeDetailsMatrix(userID, fromDate, toDate);

      if (ds.HasDataTable() && ds.Tables[0].IsDataTable())
      {
        var res = new JsonResult(new { status = true, data = ds });
        return res;
      }

      return new JsonResult(new { status = false, message = "No data found!", data = new { } });
    }







  }
}
