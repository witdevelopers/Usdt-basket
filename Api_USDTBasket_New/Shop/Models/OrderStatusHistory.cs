using System;

namespace Api.Shop.Models
{
    public class OrderStatusHistory
    {
        public long OrderId { get; set; }
        public string OrderNo { get; set; }
        public string OrderStatus { get; set; }
        public DateTime UpdatedOn { get; set; }
    }
}
