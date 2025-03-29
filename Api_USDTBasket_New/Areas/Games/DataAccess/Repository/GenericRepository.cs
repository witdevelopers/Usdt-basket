using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Api.Areas.Games.DataAccess.Repository
{
    public abstract class GenericRepository
    {

        protected  string connectionString;
        public GenericRepository(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("connectionString");
            
        }

        private SqlConnection SqlConnection()
        {
            return new SqlConnection(connectionString);
        }
        public IDbConnection CreateConnection()
        {
            var conn = SqlConnection();
            conn.Open();
           return conn;
        }
        
    }
}
