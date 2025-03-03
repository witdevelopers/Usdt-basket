namespace Api.Shop.Models
{
    public class ForgotPasswordResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string PasswordToSend { get; set; }
    }
}
