namespace Api.Shop.Models
{
    public class PasswordChangeRequestModel
    {
        public string UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public int UserType { get; set; }  // 0 for Admin, 1 for User, 2 for Franchise
        public bool IsByAdmin { get; set; } = false;
        public int ByAdminId { get; set; } = 0;
        public bool IsForgotPassword { get; set; } = false;
    }
}
