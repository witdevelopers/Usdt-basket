using System.Collections.Generic;

namespace Api.Shop.Models
{
    public class OrderCreateRequest
    {
        public long CustomerId { get; set; }
        public long AddressId { get; set; }
        public string Remarks { get; set; }
        public List<OrderPayment> OrderPayments { get; set; }
    }
}
