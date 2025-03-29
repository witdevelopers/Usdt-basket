namespace Api.Shop.Models
{
    public class State
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }
        public string Code { get; set; }
        public string ADM1Code { get; set; }
        public bool IsActive { get; set; }
    }
}
