
using Api.Areas.Games;

using Api.Shop.Repositories.Interface;
using Api.Shop.Repositories;
using Google.Api;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nethereum.JsonRpc.Client;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using TronNet;
using Api.Shop;
using Api.Services;
using Api.Middlewares;
using Api.Repositories.Interfaces;
using Api.Repositories;
using FXCapitalApi.Repositories.Interfaces;
using FXCapitalApi.Repositories;

namespace FXCapitalApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }



        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers().AddNewtonsoftJson(n =>
            {
            }).AddControllersAsServices();
            //All the repositories are configured here
            services.AddScoped<Repository>();
            services.AddTransient<ISupportRepository, SupportRepository>();

           

            services.AddTransient<DbUtils>(provider => new DbUtils(Configuration.GetConnectionString("connectionString")));

            // Register the Repository class as the implementation for IShopRepositorytwo
            services.AddScoped<IShopRepositorytwo, ShopRepository2>();


            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ISmsService, SmsService>();

            services.AddHttpClient<ICryptoService, CryptoService>();
            services.AddTransient<IAccountRepository, AccountRepository>();
            services.AddSingleton<IRsaKeyService, RsaKeyService>(provider =>
            {
                string connectionString = Configuration.GetConnectionString("connectionString");
                return new RsaKeyService(connectionString);
            });
                

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = Configuration.GetValue<string>("AppSettings:Name") + " Rest API Documentation",
                    Version = "v1"
                });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });


                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });

            var key = Configuration.GetValue<string>("AppSettings:tokenPrivateKey");
            services.AddAuthentication(x =>
             {
                 x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
             }).AddJwtBearer(x =>
             {
                 x.RequireHttpsMetadata = false;
                 x.SaveToken = true;
                 x.TokenValidationParameters = new TokenValidationParameters
                 {
                     ValidateIssuerSigningKey = true,
                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                     ValidateIssuer = false,
                     ValidateAudience = false
                 };
             });

            services.AddCors(o => o.AddPolicy("CORSPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .WithMethods("GET", "POST" , "PUT" , "DELETE")
                       .AllowAnyHeader();
            }));

            bool IsTestnet = Convert.ToBoolean(Configuration.GetValue<string>("AppSettings:IsTestnet"));
            services.AddTronNet(x =>
            {
                x.Network = TronNetwork.MainNet;
                x.Channel = new GrpcChannelOption { Host = IsTestnet ? "grpc.shasta.trongrid.io" : "grpc.trongrid.io", Port = 50051 };
                x.SolidityChannel = new GrpcChannelOption { Host = IsTestnet ? "grpc.shasta.trongrid.io" : "grpc.trongrid.io", Port = 50052 };
                x.ApiKey = "3bc262dc-8d8e-470e-b56f-4cdcbb3c8b97";
            });

            services.AddServices(Configuration);
            services.AddGameServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
         //   app.UseMiddleware<RsaDecryptionMiddleware>();

            app.UseExceptionHandler("/Error");

            app.UseSwagger();

            string sJsonUrl = (env.IsDevelopment()) ? "/swagger/v1/swagger.json" : "swagger/v1/swagger.json";
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint(sJsonUrl, Configuration.GetValue<string>("AppSettings:Name") + " API v1");
                c.RoutePrefix = String.Empty;
            });

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("CORSPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapControllerRoute(name: "areas",pattern: "{area:exists}/{controller=Games}/{action=Index}/{id?}"
          );
            });
        }
    }
}
