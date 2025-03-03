namespace FXCapitalApi.Models
{
    public class InvestmentPayload
    {
        public string transactionHash { get; set; }

        public decimal Amount { get; set; }
        public int packageId { get; set; }
    }
}
