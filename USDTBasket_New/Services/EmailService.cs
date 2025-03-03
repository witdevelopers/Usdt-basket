using System.Net.Mail;
using System.Net;
using System.Data;
using FXCapitalApi.Repositories.Interfaces;
using System;

namespace Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IAccountRepository _accountRepository;

        public EmailService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public void SendEmail(string toEmail, string subject, string body)
        {
            // Fetch Email Configuration from the repository
            DataSet emailDetails = _accountRepository.EmailOrSmsDetails(1, 0); // 1 for Email, 0 for SMS

            if (emailDetails.Tables.Count > 0 && emailDetails.Tables[0].Rows.Count > 0)
            {
                DataRow row = emailDetails.Tables[0].Rows[0];

                
           

                // Retrieve email configuration
                var fromEmail = row["MailSenderId"].ToString();            // info@superrich5.com
                var smtpHost = row["MailHostAddress"].ToString();          // smtp.office365.com
                var smtpPort = Convert.ToInt32(row["EmailPort"]);          // 587
                var smtpUser = row["MailSenderId"].ToString();             // info@superrich5.com
                var smtpPass = row["MailPassword"].ToString();             // Super@2024

                var fromAddress = new MailAddress(fromEmail, "WelsomeIT");
                var toAddress = new MailAddress(toEmail);

                using (var smtp = new SmtpClient
                {
                    Host = smtpHost,
                    Port = smtpPort,
                    EnableSsl = true,
                    Credentials = new NetworkCredential(smtpUser, smtpPass)
                })
                {
                    using (var message = new MailMessage(fromAddress, toAddress)
                    {
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    })
                    {
                        smtp.Send(message);
                    }
                }
            }
            else
            {
                throw new InvalidOperationException("Email configuration not found.");
            }
        }
    }
}
