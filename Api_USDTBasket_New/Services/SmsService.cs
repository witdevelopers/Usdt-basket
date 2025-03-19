using Api.Services;
using System;
using System.IO;
using System.Net;
using System.Text;

public class SmsService : ISmsService
{
    public string SendSms(string mobile, string message, string smsUser, string smsKey, string smsSenderId)
    {
        string result = "", user = smsUser, key = smsKey, senderid = smsSenderId;
        string templateId = "1207170997311223953";

        WebRequest request = null;
        HttpWebResponse response = null;

        try
        {
            string strMessage = message.Split('|')[1].Replace(" ", "+").Replace("\r\n", "%0A");
            string sendToPhoneNumber = mobile.Trim();
            string url = $"http://whybulksms.in/app/smsapi/index.php?username={user}&password={key}&campaign=10525&routeid=6&type=text&contacts={sendToPhoneNumber}&senderid={senderid}&msg={strMessage}&template_id={templateId}";

            request = WebRequest.Create(url);
            response = (HttpWebResponse)request.GetResponse();

            using (Stream stream = response.GetResponseStream())
            {
                Encoding ec = Encoding.GetEncoding("utf-8");
                using (StreamReader reader = new StreamReader(stream, ec))
                {
                    result = reader.ReadToEnd();
                }
            }

            return result;
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
        finally
        {
            response?.Close();
        }
    }
}
