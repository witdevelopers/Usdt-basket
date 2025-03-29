namespace Api.Shop.Models
{
    public class OrderCustomerDetails
    {
        public int Srno { get; set; }
        public int Id { get; set; }
        public string OrderNo { get; set; }
        public int CustomerId { get; set; }
        public int BillingAddressId { get; set; }
        public int ShippingAddressId { get; set; }
        public string OrderDate { get; set; }
        public string Status { get; set; }
        public decimal OrderAmount { get; set; }
        public bool IsDelivered { get; set; }
        public string DeliveredOn { get; set; }
        public bool IsCouponApplied { get; set; }
        public int? CouponId { get; set; }
        public decimal CouponAmount { get; set; }
        public string Remarks { get; set; }
        public string PaymentMethod { get; set; }
    }
}
