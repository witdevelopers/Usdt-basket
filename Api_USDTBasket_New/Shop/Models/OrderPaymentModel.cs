using System;

namespace Api.Shop.Models
{
    public class OrderPaymentModel
    {
        public string OrderId { get; set; }
        public string TransactionId { get; set; }
        public int? PaymentMethodId { get; set; }
        public string PaymentStatus { get; set; }
        public int? PaymentStatusId { get; set; }
        public decimal? AmountPaid { get; set; }
        public DateTime? OnDate { get; set; }
    }

}
