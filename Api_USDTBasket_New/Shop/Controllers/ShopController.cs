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
using Microsoft.AspNetCore.Authorization;
using Api.Services;
using Newtonsoft.Json;
namespace Api.Shop.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {

        private readonly IEmailService _emailService;

        private readonly Repository _repository;

        private readonly IRsaKeyService _rsaKeyService;

        public ShopController(Repository repository, IEmailService emailService, IRsaKeyService rsaKeyService)
        {
            _repository = repository;
            _emailService = emailService;
            _rsaKeyService = rsaKeyService;
        }


        [HttpPost("Forget-Password/SendPasswordThroughEmailID")]
        public IActionResult SendPassword(ForgotPasswordModel model)
        {
            var response = _repository.ForgotPassword(model.EmailId);

            if (response.Status == "Success")
            {
                string emailSubject = "Your Password Recovery";
                string emailBody = $"Your password is: {response.PasswordToSend}";

                // Send email using the existing EmailService
                _emailService.SendEmail(model.EmailId, emailSubject, emailBody);
                return Ok(new { message = "Password sent to your email." });
            }
            else
            {
                return BadRequest(new { message = response.Message });
            }
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] OtpEntry otpEntry)
        {
            // Generate OTP
            otpEntry.Otp = GenerateOtp();
            otpEntry.ExpirationTime = DateTime.Now.AddMinutes(5); // Set expiration time for OTP

            // Insert OTP into the database using the model
            var insertResult = await _repository.InsertOtpAsync(otpEntry);

            if (insertResult == -1)
            {
                return BadRequest("Email does not exist.");
            }

            // Send OTP via email
            string subject = "Your OTP Code";
            string body = $"Your OTP is {otpEntry.Otp}. It will expire in 5 minutes.";
            _emailService.SendEmail(otpEntry.EmailId, subject, body);

            return Ok("6 Digit OTP Code has been Successfully sent to your EmailId.");
        }



        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerificationRequest request)
        {
            if (await _repository.VerifyOtpAsync(request.EmailId, request.Otp))
            {
                return Ok("OTP verified successfully.");
            }

            return BadRequest("Invalid or expired OTP.");
        }

        private string GenerateOtp()
        {
            // Generate a random 6-digit OTP
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        [HttpGet("banners")]
        public async Task<IActionResult> GetBannersAsync()
        {
            var banners = await _repository.GetBannersAsync();
            return Ok(banners);
        }



        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _repository.ChangePasswordAsync(model);
            if (result.IsSuccess)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }

        [HttpGet("countrylist")]
        public async Task<IActionResult> GetCountryAsync()
        {
            var country = await _repository.GetCountryAsync();
            return Ok(country);
        }
        [HttpGet]
        [Route("GetStatesByCountry/{countryId:int}")]
        public async Task<IActionResult> GetStatesByCountry(int countryId)
        {
            IEnumerable<State> states = await _repository.GetStatesByCountryAsync(countryId);
            if (states == null)
            {
                return NotFound();
            }
            return Ok(states);
        }
        // Category Endpoints
        [HttpGet("allcategories_without_parentcategories")]
        public async Task<IActionResult> GetAllCategoriesAsync()
        {
            var categories = await _repository.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("allparentcategories")]
        public async Task<IActionResult> GetAllParentCategoriesAsync()
        {
            var categories = await _repository.GetAllParentCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("categories/{id}")]
        public async Task<IActionResult> GetCategoryByIdAsync(int id)
        {
            var category = await _repository.GetCategoryByIdAsync(id);
            if (category != null)
                return Ok(category);
            return NotFound();
        }



        // Product Endpoints
        [HttpGet("products-by-categoryid/{categoryId}")]
        public IActionResult GetProductsForCategory(int categoryId)
        {
            var products = _repository.GetProductsForCategory(categoryId);
            return Ok(products);
        }
        //[HttpGet("home-page-products")]
        //public async Task<IActionResult> GetHomePageProducts()
        //{
        //    try
        //    {
        //        var products = await _repository.GetHomePageProductsAsync();

        //        if (products == null || !products.Any())
        //        {
        //            return NotFound("No products found.");
        //        }

        //        return Ok(products);
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception (you may want to use a logging framework here)
        //        return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
        //    }
        //}

        [HttpGet("getprodbyidjustoneimage/{productId}")]
        public async Task<IActionResult> GetProductDetailsByIdAsync(long productId)
        {
            var product = await _repository.GetProductDetailsAsync(productId);
            if (product != null)
                return Ok(product);
            return NotFound();
        }



        [HttpGet("ProductDescription/{productId}")]
        public async Task<IActionResult> GetProductDetails(long productId)
        {
            try
            {
                var productDetails = await _repository.GetProductDetailsAsync(productId);

                if (productDetails == null)
                {
                    return NotFound(new { Message = "Product not found" });
                }

                return Ok(productDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while fetching product details", Error = ex.Message });
            }
        }

        // Home Page Endpoints
        [HttpGet("home-page/products")]
        public async Task<ActionResult<IEnumerable<HomePageProduct>>> Get()
        {
            try
            {
                // Retrieve the list of home page products
                var products = await _repository.GetHomePageProductsAsync();

                // Check if no products were found
                if (products == null || !products.Any())
                {
                    return NotFound("No products found.");
                }

                // Return the list of products
                return Ok(products);
            }
            catch (Exception ex)
            {
                // Log the exception for further analysis
                // Example: _logger.LogError(ex, "An error occurred while fetching home page products.");

                // Return a generic error response
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("home-page/products/{sectionId}")]
        public async Task<IActionResult> GetHomePageProducts(int sectionId)
        {
            var products = await _repository.GetHomePageProductsAsync(sectionId);
            if (products == null || !products.Any())
            {
                return NotFound();
            }

            return Ok(products);
        }
        [HttpGet("home-page/sections")]
        public async Task<IActionResult> GetHomePageSectionsAsync()
        {
            var sections = await _repository.GetHomePageSectionsAsync();
            return Ok(sections);
        }


        [HttpGet("allproductimages/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategoryIdAsync(int categoryId)
        {
            var products = await _repository.GetProductsByCategoryIdAsync(categoryId);
            return Ok(products);
        }

        // Shopping Cart Endpoints
        [HttpGet("Getshopping-cartDetails/{customerId}")]
        public IActionResult GetCartByCustomerId(long customerId)
        {
            var (items, summary) = _repository.GetCartByCustomerId(customerId);
            return Ok(new { Items = items, Summary = summary });
        }

        [HttpPost("shopping-cart/add")]
        public IActionResult AddToCart(long customerId, long productDtId, int quantity)
        {
            var result = _repository.AddToCart(customerId, productDtId, quantity );
            if (result.Status)
                return Ok(result);
            return BadRequest(result.Message);
        }

        [HttpPut("shopping-cart/update")]
        public IActionResult UpdateCart([FromBody] CartUpdate model)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Call the repository to update the cart
                _repository.UpdateCart(model);
                return Ok(new { Message = "Cart updated successfully!" });
            }
            catch (Exception ex)
            {
                // Return error details in the response
                return StatusCode(500, new { Message = ex.Message, Details = ex.InnerException?.Message });
            }
        }

        [HttpPut("shopping-cart-Customer/update")]
        public IActionResult UpdateMember([FromBody] MemberId model)
        {
            // Validate the model state
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Call the repository to update the cart
                _repository.UpdateMember(model);
                return Ok(new { Message = "Member updated successfully!" });
            }
            catch (Exception ex)
            {
                // Return error details in the response
                return StatusCode(500, new { Message = ex.Message, Details = ex.InnerException?.Message });
            }
        }

        [HttpDelete("shopping-cart/remove")]
        public IActionResult RemoveFromCart(long customerId, long productDtId, bool removeAll)
        {
            var response = _repository.RemoveFromCart(customerId, productDtId, removeAll);
            if (response.Status)
                return Ok(response);
            return BadRequest(response.Message);
        }



        // Search Endpoints
        [HttpGet("searchbyKeyword")]
        public IActionResult SearchProductsByKeyword(string keyword)
        {
            var products = _repository.SearchProductsByKeyword(keyword);
            return Ok(products);
        }


        [HttpGet("GetCustomerId/addresses")]
        public async Task<IActionResult> GetCustomerAddresses(long customerId)
        {
            try
            {
                var addresses = await _repository.GetCustomerAddressesAsync(customerId);
                if (addresses == null || !addresses.Any())
                {
                    return NotFound("No addresses found for the given customer ID.");
                }
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost]
        [Route("CreateAddress")]
        public IActionResult CreateAddress([FromBody] AddressCreateRequest request)
        {
            if (_repository.CreateAddress(request))
            {
                return Ok(new { Message = "Address created successfully." });
            }
            return BadRequest(new { Message = "Failed to create address." });
        }

        [HttpDelete("DeleteAddress")]
        public IActionResult DeleteAddress(int id, int addressid)
        {
            bool isDeleted = _repository.DeleteAddress(id, addressid);

            if (isDeleted)
            {
                return Ok(new { Success = true, Message = "Address deleted successfully." });
            }
            else
            {
                return BadRequest(new { Success = false, Message = "Failed to delete address." });
            }
        }
        [HttpPut("UpdateAddress")]
        public IActionResult UpdateAddress(AddressUpdateRequest request)
        {
            if (ModelState.IsValid)
            {
                bool isUpdated = _repository.UpdateAddress(request);

                if (isUpdated)
                {
                    return Ok(new { Message = "Address Updated Successfully!" });
                }
                else
                {
                    return StatusCode(500, "An error occurred while updating the address.");
                }
            }
            return BadRequest(ModelState);
        }
        [Authorize]
        [HttpPost]
        [Route("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid order data.");
            }

            var response = await _repository.CreateOrderAsync(request);

            if (!response.Status)
            {
                return BadRequest(response.Message);
            }

            // Check for Status_Wallet flag
            if (!response.StatusWallet)
            {
                return Ok(new { message = "Order placed but wallet transaction failed.", response });
            }

            return Ok(new { message = "Order placed successfully!", response });
        }
        [Authorize]
        [HttpGet("invoicebyorderno")]
        public async Task<IActionResult> GetInvoice(long orderId)
        {
            var invoice = await _repository.GetOrderInvoiceAsync(orderId);
            if (invoice == null)
                return NotFound("Invoice not found.");

            return Ok(invoice);
        }
        [HttpGet("GetCustomerOrders/{customerId}")]
        public async Task<IActionResult> GetCustomerOrders(int customerId)
        {
            try
            {
                var orders = await _repository.GetCustomerOrdersAsync(customerId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                // Log the exception as needed
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while fetching the data.");
            }
        }

        [Authorize]
        [HttpPost("CreditDebitWallet")]
        public async Task<IActionResult> CreditDebitWallet([FromBody] WalletTransactionModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid data.");
            }

            var result = await _repository.CreditDebitWalletAsync(model);

            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }
        [HttpPost("UpdateOrderStatus")]
        public IActionResult UpdateOrderStatus([FromBody] OrderUpdateResponseModel model)
        {
            if (ModelState.IsValid)
            {
                string message;
                bool success = _repository.UpdateOrderStatus(model, out message);

                var response = new ApiResponse
                {
                    Status = success,
                    Message = message
                };

                if (success)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }

            return BadRequest(new ApiResponse { Status = false, Message = "Invalid model state" });
        }


        //[HttpGet("{customerId}")]
        //public ActionResult<IEnumerable<OrderCustomerDetails>> GetOrdersByCustomerId(int customerId)
        //{
        //    var orders = _repository.GetOrdersByCustomerId(customerId);
        //    if (orders == null || !orders.Any())
        //    {
        //        return NotFound();
        //    }
        //    return Ok(orders);
        //}
        [HttpGet("GetPaymentMethod")]
        public IActionResult GetPaymentMethods()
        {
            try
            {
                var paymentMethods = _repository.GetProductOrderPaymentMethods();
                if (paymentMethods == null || paymentMethods.Count == 0)
                {
                    return NotFound(new { message = "No payment methods found." });
                }
                return Ok(paymentMethods);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving payment methods.", details = ex.Message });
            }
        }
        //// GET api/orderstatus
        [HttpGet("GetOrderStatus")]
        public IActionResult GetOrderStatuses()
        {
            try
            {
                var orderStatuses = _repository.GetProductOrderStatuses();
                if (orderStatuses == null || orderStatuses.Count == 0)
                {
                    return NotFound(new { message = "No order statuses found." });
                }
                return Ok(orderStatuses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving order statuses.", details = ex.Message });
            }
        }
        //[HttpGet("{orderId}")]
        //public IActionResult GetOrderDetailsByCustomer(int orderId)
        //{
        //    var result = _repository.GetOrderDetailsByCustomer(orderId);
        //    if (result == null || !result.Any())
        //    {
        //        return NotFound();
        //    }

        //    return Ok(result);
        //}
        //[HttpGet("GetOrderStatusForUpdate/{orderId}")]
        //public async Task<IActionResult> GetOrderStatusForUpdate(long orderId)
        //{
        //    var result = await _repository.GetOrderStatusForUpdateAsync(orderId);
        //    if (result == null || !result.Any())
        //    {
        //        return NotFound();
        //    }

        //    return Ok(result);
        //}
        //[HttpPut("UpdateOrderRequest")]
        //public async Task<IActionResult> UpdateOrder([FromBody] UpdateOrderRequest request)
        //{
        //    if (request == null)
        //    {
        //        return BadRequest("Invalid request.");
        //    }

        //    var (isSuccess, message) = await _repository.UpdateOrderAsync(request.OrderId, request.OrderStatus, request.ModifiedBy);
        //    if (isSuccess)
        //    {
        //        return Ok(new { message });
        //    }
        //    return BadRequest(new { message });
        //}
        //[HttpGet("GetFinalOrderDetails/{orderId}")]
        //public async Task<IActionResult> GetFinalOrderDetails(long orderId)
        //{
        //    var (orderDetails, paymentDetails, statusHistory) = await _repository.GetFinalOrderDetailsAsync(orderId);
        //    return Ok(new
        //    {
        //        OrderDetails = orderDetails,
        //        PaymentDetails = paymentDetails,
        //        StatusHistory = statusHistory
        //    });
        //}
        //[HttpGet("api/wallet-balance")]
        //public async Task<IActionResult> GetWalletBalance(string userId, int walletType = 1, bool isMember = true)
        //{
        //    try
        //    {
        //        var result = await _repository.GetWalletBalanceAsync(userId, walletType, isMember);
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, ex.Message);
        //    }
        //}

    }
}

