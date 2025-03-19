using Api.Repositories.Interfaces;
using FXCapitalApi.Repositories.Interfaces;
using System.Data;
using System.Data.SqlClient;

namespace Api.Repositories
{
    public class SupportRepository:ISupportRepository
    {

        private readonly IUtils utils;
        public SupportRepository(IUtils _utils) {

            utils = _utils;
        }

        public DataSet InsertCompanyMessage(string FromUserId, string ToUserId_s, bool IsToAdmin, string Subject, string Message)
        {
            DataSet ds = utils.ExecuteQuery("USP_InsertCompanyMessage",new SqlParameter[]
            {
                new SqlParameter("@FromUserId",FromUserId),
                new SqlParameter("@ToUserId_s",ToUserId_s),
                new SqlParameter("@IsToAdmin",IsToAdmin),
                new SqlParameter("@Subject",Subject),
                new SqlParameter("@Message",Message)

            });
            return ds;
        }


        public DataSet GetCompanyMessage(string UserId, bool IsAdmin, bool IsInbox)
        {
            DataSet ds = utils.ExecuteQuery("USP_GetCompanyMessage", new SqlParameter[]
            {
                new SqlParameter("@UserId",UserId),
                new SqlParameter("@IsAdmin",IsAdmin),
                new SqlParameter("@IsInbox",IsInbox)
            });
            return ds;
        }

        public DataSet DeleteCompanyMessage(string MessageId_s, bool IsInbox)
        {
            DataSet ds = utils.ExecuteQuery("USP_DeleteCompanyMessage_s", new SqlParameter[]
           {
                new SqlParameter("@MessageId_s",MessageId_s),
                new SqlParameter("@IsInbox",IsInbox)
           });
            return ds;
        }

    }
}
