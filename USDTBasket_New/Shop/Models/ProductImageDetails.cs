namespace Api.Shop.Models
{
    public class ProductImageDetails
    {
        public string CategoryName { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public decimal DiscountPrice { get; set; }
        public decimal DiscountPercentage { get; set; }

        public string ImageUrl { get; set; }
    }
}
