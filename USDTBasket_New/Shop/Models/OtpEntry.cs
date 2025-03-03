using System;

namespace Api.Shop.Models
{
    public class OtpEntry
    {
        public int Id { get; set; }
        public string EmailId { get; set; }
        public string Otp { get; set; }
        public DateTime ExpirationTime { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
