using Api.Areas.Games.DataAccess.Interfaces;
using Api.Areas.Games.Models;
using Dapper;
using FXCapitalApi.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Api.Areas.Games.DataAccess.Repository
{
    public class BetRepository : GenericRepository, IBetRepository
    {
        private readonly IUtils util;

        public BetRepository(IUtils util, IConfiguration configuration) : base(configuration)
        {
            this.util = util;
        }

        public CurrentPeriod current()
        {
            DataSet ds = util.ExecuteQuery("USP_GetCurrentPeriod");

            // Check if the DataSet and DataTable contain data
            if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                DataRow row = ds.Tables[0].Rows[0];

                // Handle null or empty values safely using TryParse and Convert with null checks
                string period = row["PeriodNo"] != DBNull.Value ? row["PeriodNo"].ToString() : string.Empty;
                int secRemainings;
                int.TryParse(row["RemainingSeconds"]?.ToString(), out secRemainings);  // TryParse to avoid FormatException
                string actualPrNo = row["ActualPrNo"] != DBNull.Value ? row["ActualPrNo"].ToString() : string.Empty;

                return new CurrentPeriod()
                {
                    Period = period,
                    secRemainings = secRemainings,
                    ActualPrNo = actualPrNo
                };
            }
            else
            {
                // Handle the case where no data is returned
                return new CurrentPeriod()
                {
                    Period = string.Empty,
                    secRemainings = 0,
                    ActualPrNo = string.Empty
                };
            }
        }

        public DataTable addBet(BetModel bet)
        {
            DataSet ds = util.ExecuteQuery("USP_InsertBet", new SqlParameter[] {
             new SqlParameter("@UserId",bet.userId),new SqlParameter("@Amount",bet.Amount),
             new SqlParameter("@Quantity",bet.Quantity),new SqlParameter("@BetOn",bet.BetOn)
            });

            return ds.Tables[0];

        }

        public IEnumerable<BetDetails> getUserCurrentOrders(string UserId, long period)
        {
            using (var connection = CreateConnection())
            {
                var query = @"SELECT * FROM [tblBetDetails] WHERE PeriodNo=@PeriodNo AND MemberId=(select MemberId from tblLogin where UserId=@UserId)";
                var param = new DynamicParameters();
                param.Add("@PeriodNo", period, DbType.Int32);
                param.Add("@UserId", UserId, DbType.String);
                return connection.Query<BetDetails>(query,param);
            }
        }

        public DataSet getPeriodWinHistory(int pageNo, int pageSize)
        {
            return util.ExecuteQuery("USP_GetPeriodWinDetails", new SqlParameter[] {
             new SqlParameter("@PageNumber",pageNo),new SqlParameter("@PageSize",pageSize)
            });

        }

        public DataSet getBetDetails(string userId, string periodNo_Display, int pageNumber, int pageSize)
        {
            return util.ExecuteQuery("USP_GetBets", new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@PeriodNo_Display", periodNo_Display),
                new SqlParameter("@PageNumber", pageNumber),
                new SqlParameter("@PageSize", pageSize)
            });
        }

        public DataSet getPeriodDetails(string periodNo)
        {
            return util.ExecuteQuery("USP_GetPeriodDetails", new SqlParameter[]
               {
                new SqlParameter("@PeriodNo", periodNo),
               });

        }

    }
}
