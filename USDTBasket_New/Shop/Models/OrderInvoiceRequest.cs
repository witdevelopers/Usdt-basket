using System;

namespace Api.Shop.Models
{
    public class OrderInvoiceRequest
    {
        public long OrderId { get; set; }
        public long AddressId { get; set; }
        public long CustomerId { get; set; }
        public string OrderNo { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public decimal OrderAmount { get; set; }
        public bool IsDelivered { get; set; }
        public DateTime? DeliveredOn { get; set; }
        public string Remarks { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
