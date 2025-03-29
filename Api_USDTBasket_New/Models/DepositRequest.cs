namespace Api.Models
{
    public class DepositRequest
    {
        public decimal Amount { get; set; }
        public string TransactionHash { get; set; }
    }

}
