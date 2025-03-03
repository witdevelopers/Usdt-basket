using Microsoft.AspNetCore.Mvc;
using Api.Shop.Models;
using Api.Shop.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using static IShopRepository;
using System;
using System.Linq;
using Dapper;
using Microsoft.AspNetCore.Http;
using Api.Shop.Repositories.Interface;


namespace Api.Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoptwoController : ControllerBase
    {
        private readonly IShopRepositorytwo _shopRepository;

        public ShoptwoController(IShopRepositorytwo shopRepository)
        {
            _shopRepository = shopRepository;
        }

        // Banner Endpoints
        [HttpGet("banners")]
        public async Task<IActionResult> GetBannersAsync()
        {
            var banners = await _shopRepository.GetBannersAsync();
            return Ok(banners);
        }
        [HttpGet("allcategories_without_parentcategories")]
        public async Task<IActionResult> GetAllCategoriesAsync()
        {
            var categories = await _shopRepository.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("allparentcategories")]
        public async Task<IActionResult> GetAllParentCategoriesAsync()
        {
            var categories = await _shopRepository.GetAllParentCategoriesAsync();
            return Ok(categories);
        }


        // You can add other endpoints here that use _shopRepository
    }

}
