using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FXCapitalApi.Authentication
{
    public class JWTAuthentication : IJWTAuthentication
    {
        private readonly string key;

        public JWTAuthentication(string key)
        {
            this.key = key;
        }

        public string GenerateUserToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.UserData, userId)
                }),
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        //public string GetName(string token)
        //{
        //    var tokenKey = Encoding.ASCII.GetBytes(key);
        //    var handler = new JwtSecurityTokenHandler();
        //    var validations = new TokenValidationParameters
        //    {
        //        ValidateIssuerSigningKey = true,
        //        IssuerSigningKey = new SymmetricSecurityKey(tokenKey),
        //        ValidateIssuer = false,
        //        ValidateAudience = false
        //    };
        //    var claims = handler.ValidateToken(token, validations, out var tokenSecure);
        //    return claims.Identity.Name;
        //}
    }
}
