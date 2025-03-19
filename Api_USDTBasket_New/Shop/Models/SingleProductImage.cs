using System;

namespace Api.Shop.Models
{
    public class SingleProductImage
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public long ProductDtId { get; set; }
        public string SKUCode { get; set; }
        public string ImageUrl { get; set; }
        public string RelativeUrl { get; set; }
        public bool IsMainImage { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
