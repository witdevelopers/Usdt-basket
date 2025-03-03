using System;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Text;

namespace Api.Services
{
    public class RsaKeyService : IRsaKeyService
    {
        private readonly string _connectionString;

        public RsaKeyService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public string GetPrivateKey()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT PrivateKey FROM tblKeys WHERE Id = 1", conn);
                conn.Open();
                return cmd.ExecuteScalar()?.ToString();
            }
        }

        public string GetPublicKey()
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("SELECT PublicKey FROM tblKeys WHERE Id = 1", conn);
                conn.Open();
                return cmd.ExecuteScalar()?.ToString();
            }
        }

        public string EncryptData(string plainText)
        {
            var publicKeyString = GetPublicKey();
            using (var rsa = RSA.Create())
            {
                rsa.FromXmlString(publicKeyString);

                byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
                byte[] encryptedBytes = rsa.Encrypt(plainBytes, RSAEncryptionPadding.Pkcs1);

                return Convert.ToBase64String(encryptedBytes);
            }
        }
    }
}
