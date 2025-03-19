using System;

namespace Api.Shop.Models
{
    public class Get_Product_For_Category
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public string CategoryName { get; set; }
        public string BrandName { get; set; }
        public DateTime CreatedOn { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal Price { get; set; }
        public bool HasVariant { get; set; }
        public string ImageUrl { get; set; }
    }
}
