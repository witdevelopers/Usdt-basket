using System;

namespace Api.Shop.Models
{
    public class ProductDetails
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; }
        public string Name { get; set; }
        public long ProductDtId { get; set; }
        public string SKUCode { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }

        public decimal? DiscountPercentage { get; set; }
        public decimal BV { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsActive { get; set; }

        //public string Size {  get; set; }
        //public long SizeId {  get; set; }
        public DateTime? ModifiedOn { get; set; }
        public int Stock { get; set; }
        public DateTime? StockUpdatedOn { get; set; }
    }
}
