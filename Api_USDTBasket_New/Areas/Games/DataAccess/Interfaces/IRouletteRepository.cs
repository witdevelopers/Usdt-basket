using Api.Areas.Games.Models;
using System.Data;

namespace Api.Areas.Games.DataAccess.Interfaces
{
    public interface IRouletteRepository
    {
        DataTable PlaceBet(BetModel bet);
        DataSet GetAllBets(string userId, int pageNumber, int pageSize);
    }
}
