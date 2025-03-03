using System;

namespace Api.Shop.Models
{
    public class PaymentDetail
    {
        public long OrderId { get; set; }
        public string OrderNo { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public decimal AmountPaid { get; set; }
        public DateTime OnDate { get; set; }
    }
}
