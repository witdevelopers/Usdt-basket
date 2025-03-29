namespace Api.Shop.Models
{
    public class ProductStockModel
    {
        public int Id { get; set; }
        public long ProductDtId { get; set; }
        public int Stock { get; set; }
        public string StockType { get; set; }
        public string Remarks { get; set; }
        public string TransactionId { get; set; }
        public string TransactionDetails { get; set; }
    }
}
