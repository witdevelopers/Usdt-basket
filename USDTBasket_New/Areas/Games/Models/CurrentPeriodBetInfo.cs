
namespace Api.Areas.Games.Models
{
    public class CurrentPeriodBetInfo
    {
        public string number { get; set; }
        public string color1 { get; set;}
        public string color2 { get; set;}

        public decimal betOnNumber { get; set; }
        public decimal betOnColor1 { get; set; }
        public decimal betOnColor2 { get; set; }

        public decimal payoutOnNumber { get; set; }
        public decimal payoutOnColor1 { get; set; }
        public decimal payoutOnColor2 { get; set; }

        public decimal totalPayoutAmount { get; set; }
        public int isPossibleWinner { get; set; }

    }
}
