using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GowinzoApi.Models
{
    public class WithdrawalModel
    {
        public int Srno { get; set; }

        public int RequestId { get; set; }

        public string UserId { get; set; }

        public string Name { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public DateTime OnDate { get; set; }

        public string MemberRemarks { get; set; }

        public string Status { get; set; }

        public string AdminRemarks { get; set; }

        public DateTime? AcceptRejectDate { get; set; }

        public string BankDetails { get; set; }
    }

    public class WithdrawalApproveRejectModel
    {
        public int requestId { get; set; }

        public int status { get; set; }

        public string adminRemarks { get; set; }

        public int adminId { get; set; }

    }
}
