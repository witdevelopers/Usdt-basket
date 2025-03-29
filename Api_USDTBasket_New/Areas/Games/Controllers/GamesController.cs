using Api.Areas.Games.DataAccess.Interfaces;
using Api.Areas.Games.Models;
using FXCapitalApi.Repositories;
using GowinzoApi.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using TronNet.Protocol;

namespace Api.Areas.Games.Controllers
{
    [Authorize]
    [Area("Games")]
    [Route("[controller]")]
    [ApiController]
    public class GamesController:ControllerBase
    {
        private readonly IUserWalletRepository wallet;
        private readonly IBetRepository betRepository;

        public GamesController(IUserWalletRepository wallet,IBetRepository betRepository)
        {
            this.wallet = wallet;
            this.betRepository = betRepository;
        }

        [HttpGet("current")]
        public IActionResult current()
        {
            return new JsonResult(betRepository.current());

        }

        [HttpGet("GetGames")]
        public IActionResult GetGames()
        {
            return Ok(new[]{"Color","Spin"});
        }

        [HttpGet("userDetails")]
        public IActionResult GetUserDetails()
        {
            string userId = User.getUserId();
            
            decimal WalletBalance = wallet.getBalance(userId, 1).Balance;
            var curr = betRepository.current();
            var currentOrders = betRepository.getUserCurrentOrders(userId, Convert.ToInt64(curr.ActualPrNo));
            currentOrders.ToList().ForEach(c => { c.PeriodNo = Convert.ToInt64(curr.Period); });
            return new JsonResult(new { WalletBalance, orders = currentOrders });
        }


        [HttpPost("addOrder")]
        public IActionResult AddBet(BetModel model)
        {
            string userId = User.getUserId();
            model.userId = userId;
            var rs = betRepository.addBet(model);
            var status = rs.IsDataTable() && Convert.ToBoolean(rs.Rows[0]["Success"]);
            var message = rs.Rows[0]["Message"].ToString();
            return new JsonResult(new { status, message });
        }

        [HttpGet("periodWinHistory")]
        public IActionResult periodWinHistory([FromQuery] int pageNo = 1, [FromQuery] int pageSize = 10)
        {
            var rs = betRepository.getPeriodWinHistory(pageNo, pageSize);
            return new JsonResult(new { data = rs.Tables[0].getJson(), total = Convert.ToInt32(rs.Tables[1].Rows[0][0].ToString()) });
        }

        [HttpGet("getUserAllOrders")]
        public IActionResult getUserAllOrders([FromQuery] int pageNo = 1, [FromQuery] int pageSize = 10)
        {
            string userId = User.getUserId();
            var rs = betRepository.getBetDetails(userId, "", pageNo, pageSize);
            return new JsonResult(new { data = rs.Tables[0].getJson(), total = Convert.ToInt32(rs.Tables[1].Rows[0][0].ToString()) });
        }

        [HttpGet("getPeriodDetails/")]
        public IActionResult getPeriodDetails([FromQuery] string periodNo)
        {
            var rs = betRepository.getPeriodDetails(periodNo);
            if (rs.HasDataTable() && rs.Tables[0].IsDataTable())
                return new JsonResult(rs.Tables[0].getJsonRow(0));
            else
                return Ok();
        }
    }
}
