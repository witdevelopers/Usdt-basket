namespace Api.Shop.Models
{
    public class GetOrderDetail
    {
        public long OrderId { get; set; }
        public string ProductDtId { get; set; }
        public string SKUCode { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal BV { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalBV { get; set; }
    }
}
