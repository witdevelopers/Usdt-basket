using System;

namespace Api.Shop.Models
{
    public class Get_Customer_Address
    {
        public long Srno { get; set; }
        public long MemberId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public char Gender { get; set; }
        public string Address { get; set; }
        public string District { get; set; }
        public int State { get; set; }
        public int Country { get; set; }
        public string Pincode { get; set; }
        public string MobileNo { get; set; }
        public string EmailId { get; set; }
        public string ProfileImage { get; set; }
    }
}
