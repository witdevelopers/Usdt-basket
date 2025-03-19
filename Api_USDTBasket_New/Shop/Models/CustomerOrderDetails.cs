using System;

namespace Api.Shop.Models
{
    public class CustomerOrderDetails
    {
        public long Id { get; set; }
        public string OrderNo { get; set; }

        public long ProductDtId { get; set; }
        public string ProductName { get; set; }

        public string ImageUrl { get; set; }
        public string SingleProductOrderStatus {  get; set; }

        public decimal SingleProductOrderPrice { get; set; }
        public long CustomerId { get; set; }
        public long BillingAddressId { get; set; }
        public long ShippingAddressId { get; set; }
        public string? OrderDate { get; set; }
        public string? Status { get; set; }
        public decimal OrderAmount { get; set; }
        public bool? IsDelivered { get; set; }
        public DateTime? DeliveredOn { get; set; }
        public bool? IsCouponApplied { get; set; }
        public int? CouponId { get; set; }
        public decimal? CouponAmount { get; set; }
        public string? Remarks { get; set; }
        public string? PaymentMethod { get; set; }
    }
}
