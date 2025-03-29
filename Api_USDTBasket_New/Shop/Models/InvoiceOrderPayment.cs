namespace Api.Shop.Models
{
    public class InvoiceOrderPayment
    {
        public long OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string Icon { get; set; }
        public decimal AmountPaid { get; set; }
    }
}
