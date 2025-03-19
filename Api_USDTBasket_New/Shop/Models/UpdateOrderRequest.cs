namespace Api.Shop.Models
{
    public class UpdateOrderRequest
    {
        public long OrderId { get; set; }
        public int OrderStatus { get; set; }
        public int ModifiedBy { get; set; }
    }
}
