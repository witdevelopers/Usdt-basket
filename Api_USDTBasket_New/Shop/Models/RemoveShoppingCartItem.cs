using System;

namespace Api.Shop.Models
{
    public class RemoveShoppingCartItem
    {
        public long CustomerId { get; set; }
        public long ProductDtId { get; set; }
        public DateTime AddedDate { get; set; }
        public int Quantity { get; set; }
    }
}
