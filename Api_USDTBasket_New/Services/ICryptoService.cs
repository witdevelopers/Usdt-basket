using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Api.Services
{
    public interface ICryptoService
    {
        Dictionary<string, string> GenerateCryptoAddresses(bool uniqueChainsOnly);
    decimal GetRate(string crypto, string toCurrency);
        decimal CalculateCryptoAmount(decimal usdAmount, string crypto);
        void RegisterAddressToListener(string address, string crypto);
    }
}

