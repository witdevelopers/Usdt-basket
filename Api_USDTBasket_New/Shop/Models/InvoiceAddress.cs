﻿using System;

namespace Api.Shop.Models
{
    public class InvoiceAddress
    {
        public long CustomerId { get; set; }
        public long AddressId { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string PostalCode { get; set; }
        public string CityName { get; set; }
        public int StateId { get; set; }
        public int CountryId { get; set; }
        public string Type { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsActive { get; set; }
    }
}
