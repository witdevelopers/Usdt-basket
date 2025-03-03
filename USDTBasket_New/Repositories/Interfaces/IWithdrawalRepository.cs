using GowinzoApi.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace GowinzoApi.DataAccess
{
    public interface IWithdrawalRepository
    {
        //DataTable addWithdrawalRequest(WithdrawalModel withdrawal);
        List<WithdrawalModel> getWithdrawalRequests(string userId, string fromDate = "", string toDate = "", int status = -1);
        //DataTable approveRejectRequests(List<WithdrawalModel> data, int status, int AdminId);
        DataSet getPassbook(PassbookPayload passbook);
    }
}
