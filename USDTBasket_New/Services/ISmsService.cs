namespace Api.Services
{
    public interface ISmsService
    {
        string SendSms(string mobile, string message, string smsUser, string smsKey, string smsSenderId);
    }
}
