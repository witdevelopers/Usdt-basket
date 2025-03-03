using System;

namespace Api.Shop.Models
{
    public class GetCustomerAddress
    {
        public long CustomerId { get; set; } // Ensure this matches the data type in the database
        public int AddressId { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string PostalCode { get; set; }
        public string CityName { get; set; }
        public int StateId { get; set; }
        public string StateName { get; set; }
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int AddressTypeId { get; set; }
        public string AddressType { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}
