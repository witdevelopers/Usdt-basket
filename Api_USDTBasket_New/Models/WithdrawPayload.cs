namespace FXCapitalApi.Models
{
    public class WithdrawPayload
    {
        public string userAddress { get; set; }
        public string signature {get; set;}
        public decimal amount { get; set;}
    }
}
