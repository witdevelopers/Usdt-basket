namespace FXCapitalApi.Models
{
    public class TransactionValidity
    {
        public bool isValid;
        public string fromAddress;
        public decimal transactionAmount;
        public string data { get; set; } // Optional: Additional data (e.g., transaction input).
        public string reason { get; set; } // Reason for validation failure.
    }
}
