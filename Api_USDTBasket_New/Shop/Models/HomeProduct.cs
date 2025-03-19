using System;

namespace Api.Shop.Models
{
    public class HomeProduct
    {
        public int Id { get; set; }
        public string SectionName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
