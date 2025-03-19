using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Threading.Tasks;
using System;
using Dapper;

namespace Api.Shop
{
    public class DbUtils
    {
        private readonly string _connectionString;

        public DbUtils(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<T>> ExecuteQueryAsync<T>(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<T>(
                    storedProcedure,
                    parameters,
                    commandType: commandType
                );
            }
        }

        public async Task<int> ExecuteAsync(string storedProcedure, object parameters = null, CommandType commandType = CommandType.StoredProcedure)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.ExecuteAsync(
                    storedProcedure,
                    parameters,
                    commandType: commandType
                );
            }
        }
    }

}
