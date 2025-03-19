using System;

namespace Api.Shop.Models
{
    public class HomePageProductBySectionId
    {
        public int Id { get; set; }
        public int SectionId { get; set; }
        public string SectionName { get; set; }
        public int ProductId { get; set; }
        public int DisplayOrder { get; set; }
        public double? DiscountPrice { get; set; }
        public string ImageUrl { get; set; }
        public string ProductName { get; set; }
        public bool HasVariant { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
