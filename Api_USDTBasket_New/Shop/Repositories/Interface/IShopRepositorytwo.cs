using Api.Shop.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Shop.Repositories.Interface
{
    public interface IShopRepositorytwo
    {
        Task<IEnumerable<Banner>> GetBannersAsync();
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<IEnumerable<ParentCategory>> GetAllParentCategoriesAsync();
    }
}
