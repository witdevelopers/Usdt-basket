namespace Api.Shop.Models
{
    public class OrderUpdateResponseModel : ApiResponse
    {

        public long OrderId { get; set; }
        public long ProductDtId { get; set; }
        public long MemberId { get; set; }
        public int OrderStatus { get; set; }
        public int ModifiedBy { get; set; }
    }
}
