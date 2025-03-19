namespace Api.Shop.Models
{
    public class GetShoppingCartItem
    {
        public long CartId { get; set; }
        public long CustomerId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal BV { get; set; }
        public long ProductDtId { get; set; }
        public string ImageUrl { get; set; }
        public long ProductId { get; set; }
        public int ActiveStatus { get; set; }
        public int StockStatus { get; set; }
        //public string Size {  get; set; }
        //public long SizeId { get; set; }


    }
}
