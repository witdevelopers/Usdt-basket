using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Api.Shop.Models;
using static Api.Shop.Repositories.Interface.IShopRepositorytwo;
using System.Linq;
using Org.BouncyCastle.Asn1.X509;
using System.Text;
using Api.Utilities;
using TronNet.Protocol;
using Api.Shop.Repositories.Interface;

namespace Api.Shop.Repositories
{
    public class ShopRepository2: IShopRepositorytwo
    {

        private readonly DbUtils _dbUtils;

        public ShopRepository2(IConfiguration configuration)
        {
            _dbUtils = new DbUtils(configuration.GetConnectionString("connectionString"));
        }

        public async Task<IEnumerable<Banner>> GetBannersAsync()
        {
            return await _dbUtils.ExecuteQueryAsync<Banner>("USP_Get_HomePage_Banners");
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _dbUtils.ExecuteQueryAsync<Category>("USP_GetCategories");
        }
        public async Task<IEnumerable<ParentCategory>> GetAllParentCategoriesAsync()
        {
            return await _dbUtils.ExecuteQueryAsync<ParentCategory>("USP_GetCategories");
        }

    }
}
