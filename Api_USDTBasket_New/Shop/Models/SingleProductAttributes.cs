namespace Api.Shop.Models
{
    public class SingleProductAttributes
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public long ProductDtId { get; set; }
        public string Attribute { get; set; }
        public string AttributeValue { get; set; }

    }
}
