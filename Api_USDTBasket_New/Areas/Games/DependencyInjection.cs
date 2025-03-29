

using Api.Areas.Games.DataAccess.Interfaces;
using Api.Areas.Games.DataAccess.Repository;
using Microsoft.Extensions.DependencyInjection;

namespace Api.Areas.Games
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddGameServices(this IServiceCollection services)
        {
            services.AddTransient<IBetRepository, BetRepository>();
            services.AddTransient<IRouletteRepository, RouletteRepository>();
            return services;
        }
    }
}
