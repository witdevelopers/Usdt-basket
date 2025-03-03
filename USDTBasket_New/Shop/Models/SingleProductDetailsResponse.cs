using System.Collections.Generic;

namespace Api.Shop.Models
{
    public class SingleProductDetailsResponse
    {
        public SingleProduct SingleProduct { get; set; }
        public List<SingleProductDetails> SingleProductDetails { get; set; }
        public List<SingleProductAttributes> SingleProductAttributes { get; set; }
        public List<SingleProductImage> SingleProductImages { get; set; }
       // public List<SingleProductSize> SingleProductSize { get; set; }
    }
}
