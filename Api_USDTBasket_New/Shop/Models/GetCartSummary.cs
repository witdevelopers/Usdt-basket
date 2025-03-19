namespace Api.Shop.Models
{
    public class GetCartSummary
    {
        public decimal PriceTotal { get; set; }
        public decimal DiscountPriceTotal { get; set; }
        public decimal BVTotal { get; set; }
    }
}
