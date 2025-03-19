using Api.Areas.Games.DataAccess.Interfaces;
using Api.Areas.Games.Models;
using FXCapitalApi.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;

namespace Api.Areas.Games.DataAccess.Repository
{
    public class RouletteRepository : GenericRepository, IRouletteRepository
    {
        private readonly IUtils util;

        public RouletteRepository(IUtils util, IConfiguration configuration) : base(configuration)
        {
            this.util = util;
        }

        public DataTable PlaceBet(BetModel bet)
        {
            DataSet ds = util.ExecuteQuery("USP_InsertBet_Roulette", new SqlParameter[] {
                new SqlParameter("@UserId",bet.userId),
                new SqlParameter("@Amount",bet.Amount),
                new SqlParameter("@BetOn",bet.BetOn)
            });

            return ds.Tables[0];

        }

        public DataSet GetAllBets(string userId, int pageNumber, int pageSize)
        {
            return util.ExecuteQuery("USP_GetBets_Roulette", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            });
        }

    }
}
