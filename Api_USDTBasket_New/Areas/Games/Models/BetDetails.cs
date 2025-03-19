using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Areas.Games.Models
{
    [Table("tblBetDetails")]
    public class BetDetails
    {
        public long Id { get; set; }
        public long PeriodNo { get; set; }
        public long MemberId { get; set; }
        [Required]
        public decimal Amount { get; set; }
        public string BetOn { get; set; }
        public DateTime OnDate { get; set; }
        public decimal Deduction { get; set; }
        public decimal BetAmount { get; set; }
        public int Quantity { get; set; }
    }
}
