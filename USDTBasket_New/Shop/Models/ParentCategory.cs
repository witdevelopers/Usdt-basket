namespace Api.Shop.Models
{
    public class ParentCategory
    {
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public int? ParentID { get; set; } // Nullable ParentID
      //  public string ParentCategoryName { get; set; }

    }
}
