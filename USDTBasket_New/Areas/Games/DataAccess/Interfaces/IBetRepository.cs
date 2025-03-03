using Api.Areas.Games.Models;
using System.Collections.Generic;
using System.Data;

namespace Api.Areas.Games.DataAccess.Interfaces
{
    public interface IBetRepository
    {
        CurrentPeriod current();
        DataTable addBet(BetModel bet);
        IEnumerable<BetDetails> getUserCurrentOrders(string UserId, long period);
        DataSet getPeriodWinHistory(int pageNo, int pageSize);
        DataSet getBetDetails(string userId, string periodNo_Display, int pageNumber, int pageSize);
        DataSet getPeriodDetails(string periodNo);
    }
}
