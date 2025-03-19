using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GowinzoApi.Models
{
    public class UserWallet
    {
        public decimal Balance { get; set; }
        public decimal Commission { get; set; }
        public decimal Interest { get; set; }
    }

    public class ApproveRejectInvestment
    {
        public int RequestId { get; set; }
        public int Status { get; set; }
        public string AdminRemarks { get; set; }
        public int AdminId { get; set; }
    }

    public class PassbookPayload
    {
        public string userId { get; set; }
        public string pageNo { get; set; }
        public string pageSize { get; set; }
    }

    public class CreditDebit
    {
        public string userId { get; set; }
        public string type { get; set; }
        public int walletType { get; set; }
        public decimal amount { get; set; }
        public int adminId { get; set; }
        public string remarks { get; set; }
    }
}
