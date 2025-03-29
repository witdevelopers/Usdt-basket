namespace Api.Shop.Models
{
    public class WalletTransactionModel
    {
        public string UserId { get; set; }
        public int WalletType { get; set; }
        public string Type { get; set; } // "Credit" or "Debit"
        public decimal Amount { get; set; }
        public string Remarks { get; set; } = string.Empty;
        public int ByAdminId { get; set; }
    }
}
