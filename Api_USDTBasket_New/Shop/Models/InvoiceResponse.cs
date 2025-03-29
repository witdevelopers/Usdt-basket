using System.Collections.Generic;
using TronNet.Protocol;

namespace Api.Shop.Models
{
    public class InvoiceResponse
    {
        public OrderInvoiceRequest Order { get; set; }
        public List<InvoiceOrderDetail> OrderDetails { get; set; }
        public List<InvoiceOrderPayment> Payments { get; set; }
        public InvoiceAddress ShippingAddress { get; set; }
    }
}
