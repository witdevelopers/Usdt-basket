using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Areas.Games.Models
{
    public class BetModel: BetDetails
    {
        public string userId { get; set; }
    }

    public class CurrentPeriod
    {
        public string Period { get; set; }
        public int secRemainings { get; set; }
        public string ActualPrNo { get; set; }
    }
}
