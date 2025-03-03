namespace Api.Shop.Models
{
    public class WalletBalance
    {

        public int Srno { get; set; }          // Assuming Srno is int
        public string UserId { get; set; }     // UserId as string
        public string Name { get; set; }       // Name as string
        public decimal BalanceAmount { get; set; }  // BalanceAmount as decimal
    }
}
