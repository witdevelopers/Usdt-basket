using System.Data;

namespace Api.Repositories.Interfaces
{
    public interface ISupportRepository
    {

        DataSet InsertCompanyMessage(string FromUserId,string ToUserId_s,bool IsToAdmin , string Subject , string Message);
        DataSet GetCompanyMessage(string UserId,bool IsAdmin , bool IsInbox);
        DataSet DeleteCompanyMessage(string MessageId_s, bool IsInbox);
    }
}
