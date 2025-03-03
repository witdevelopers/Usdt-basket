namespace Api.Shop.Models
{
    public class OrderDetailsCustomer
    {
        public int? OrderId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public decimal? BV { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? TotalBV { get; set; }
    }
}
