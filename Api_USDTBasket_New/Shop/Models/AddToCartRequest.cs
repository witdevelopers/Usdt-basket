namespace Api.Shop.Models
{
    public class AddToCartRequest
    {
        public long CustomerId { get; set; }
        public long ProductDtId { get; set; }
        public int Quantity { get; set; }
      //  public long SizeId { get; set; }
    }
}
