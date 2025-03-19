using System.Threading.Tasks;

namespace Api.Services
{
    public interface IRsaKeyService
    {
        string GetPrivateKey();
        string GetPublicKey();

        string EncryptData(string plainText); // Add this line
    }
}
