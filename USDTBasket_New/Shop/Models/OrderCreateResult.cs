namespace Api.Shop.Models
{
    public class OrderCreateResult
    {
        public bool Status { get; set; }
        public bool StatusWallet { get; set; }
        public string Message { get; set; }
        public string OrderNo { get; set; }
        public long OrderId { get; set; }
    }
}
