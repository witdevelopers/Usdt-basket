using System;

namespace Api.Shop.Models
{
    public class SingleProductSize
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public long ProductDtId { get; set; }
        public string SizeDescription { get; set; }
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string SKUCode { get; set; }

    }
}
