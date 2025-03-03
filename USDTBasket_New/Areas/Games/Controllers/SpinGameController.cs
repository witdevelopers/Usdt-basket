using Api.Areas.Games.DataAccess.Interfaces;
using Api.Areas.Games.DataAccess.Repository;
using Api.Areas.Games.Models;
using FXCapitalApi.Repositories;
using GowinzoApi.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Api.Areas.Games.Controllers
{
    [Authorize]
    [Area("Games")]
    [Route("Games/[controller]")]
    [ApiController]
    public class SpinGameController : ControllerBase
    {
        private readonly IRouletteRepository betRepository;
        private readonly IUserWalletRepository wallet;

        public SpinGameController(IRouletteRepository betRepository, IUserWalletRepository wallet)
        {
            this.betRepository = betRepository;
            this.wallet = wallet;
        }

        [HttpGet("Get")]
        public IActionResult Get()
        {
            return Ok("Spin Game");
        }

        [HttpPost("PlaceBet")]
        public IActionResult PlaceBet(BetModel model)
        {
            try
            {
                string userId = User.getUserId(); // Retrieve userId from token or identity
                model.userId = userId;

                // Call the stored procedure using the repository
                var rs = betRepository.PlaceBet(model);

                // Check if the result set contains any rows before accessing them
                if (rs.IsDataTable() && rs.Rows.Count > 0)
                {
                    // Fetch success and message values from the first row
                    var status = Convert.ToBoolean(rs.Rows[0]["Success"]);
                    var message = rs.Rows[0]["Message"].ToString();

                    // Prepare the response
                    return new JsonResult(new
                    {
                        status,
                        message,
                        data = new
                        {
                            winNumber = status ? Convert.ToInt32(rs.Rows[0]["WinNumber"]) : 0, // Only get WinNumber if success
                            winColor = "" // Can be populated if needed
                        }
                    });
                }
                else
                {
                    // If no rows are returned, send a failure response
                    return new JsonResult(new
                    {
                        status = false,
                        message = "No result returned from the database."
                    });
                }
            }
            catch (Exception ex)
            {
                // Log the exception and return a failure response
                return new JsonResult(new
                {
                    status = false,
                    message = "An error occurred while processing the bet: " + ex.Message
                });
            }
        }


        [HttpGet("GetAllBets")]
        public IActionResult GetAllBets([FromQuery] int pageNo = 1, [FromQuery] int pageSize = 10)
        {
            string userId = User.getUserId();
            var rs = betRepository.GetAllBets(userId, pageNo, pageSize);
            return new JsonResult(new { data = rs.Tables[0].getJson(), total = Convert.ToInt32(rs.Tables[1].Rows[0][0].ToString()) });
        }


        [HttpGet("GetBalance")]
        public IActionResult GetBalance([FromQuery] int pageNo = 1, [FromQuery] int pageSize = 10)
        {
            string userId = User.getUserId();
            decimal WalletBalance = wallet.getBalance(userId, 1).Balance;
            return new JsonResult(new { balanceAmount= WalletBalance });
        }

    }
}
