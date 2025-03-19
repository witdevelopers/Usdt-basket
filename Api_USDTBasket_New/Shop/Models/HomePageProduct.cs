using System;

namespace Api.Shop.Models
{
    public class HomePageProduct
    {
        public int Id { get; set; }
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public double ProductId { get; set; }
        public int DisplayOrder { get; set; }
        public decimal? Price { get; set; }  // Numeric column
        public decimal? DiscountPrice { get; set; }  // Integer column
        public decimal? DiscountPercentage { get; set; }  // Decimal column
        public string ImageUrl { get; set; }
        public string ProductName { get; set; }
        public bool HasVariant { get; set; }
        public DateTime CreatedOn { get; set; }
    }

}
