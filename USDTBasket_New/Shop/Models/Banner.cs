using System;

namespace Api.Shop.Models
{
    public class Banner
    {
        public int Id { get; set; }
        //public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string? Caption { get; set; }
        public string? LandingUrl { get; set; }
        public int? DisplayOrder { get; set; }
        public DateTime CreationDate { get; set; }
        public int CreatedBy {  get; set; }
    }

}
