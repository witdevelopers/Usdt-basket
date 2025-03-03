namespace Api.Shop.Models
{
    public class OtpVerificationRequest
    {
        public string EmailId { get; set; }
        public string Otp { get; set; }
    }
}
