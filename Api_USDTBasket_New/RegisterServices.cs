using FXCapitalApi.Authentication;
using FXCapitalApi.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using GowinzoApi.DataAccess;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FXCapitalApi
{
    public static class RegisterServices
    {
        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            var key = configuration.GetValue<string>("AppSettings:tokenPrivateKey");
            services.AddSingleton<IJWTAuthentication>(new JWTAuthentication(key));
            services.AddSingleton<IUtils, Utils>();
            services.AddSingleton<IAccountRepository, AccountRepository>();
            services.AddSingleton<ITransaction, Transaction>();
            services.AddSingleton<IFundRepository, FundRepository>();
            services.AddSingleton<IUserHomeRepository, UserHomeRepository>();
            services.AddSingleton<IUserWalletRepository, UserWalletRepository>();
            services.AddSingleton<IWithdrawalRepository, WithdrawalRepository>();
        }
    }
}
