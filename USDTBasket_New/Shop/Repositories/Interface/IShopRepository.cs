using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Api.Shop.Models;
using Org.BouncyCastle.Asn1.X509;

public interface IShopRepository
{ 
    public interface IBannerRepository
    {
        Task<IEnumerable<Banner>> GetBannersAsync();
    }

    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<IEnumerable<Category>> GetCategoryByIdAsync(int categoryId);
    }
    public interface IParentCategoryRepository
    {
        Task<IEnumerable<ParentCategory>> GetAllParentCategoriesAsync();
        
    }

    //public interface IGetCustomerAddressRepository
    //{
    //    Get_Customer_Address GetMemberInfoByCustomerId(long customerId);
    //}

    public interface IGetProductForCategoryRepository
    {
        DataSet GetProductsForCategory(int categoryId);
    }

    public interface IGetShoppingCartRepository
    {
        (List<GetShoppingCartItem> Items, GetCartSummary Summary) GetCartByCustomerId(long customerId);
    }

    public interface IHomePageProductsRepository
    {
        Task<IEnumerable<HomePageProduct>> GetHomePageProductsAsync();
    }
    public interface IHomePageProductsBySectionIdRepository
    {
        Task<IEnumerable<HomePageProduct>> GetHomePageProductsAsync(int sectionId);
    }
    public interface IHomeProductRepository
    {
        Task<IEnumerable<HomeProduct>> GetHomePageSectionsAsync();
    }

    public interface IProductDetailsRepository
    {
        Task<IEnumerable<ProductDetails>> GetProductDetailsAsync();
    }

    public interface IProductImageRepository
    {
        Task<ProductImageDetails> GetProductDetailsByIdAsync(int productId);
    }

    public interface IProductListRepository
    {
        Task<IEnumerable<ProductList>> GetProductsByCategoryIdAsync(int categoryId);
    }

    public interface IRemoveCartRepository
    {
        RemoveCartResponse RemoveFromCart(long customerId, long productDtId, bool removeAll);
    }

    public interface ISearchProductRepository
    {
        List<SearchProductResponse> SearchProductsByKeyword(string keyword);
    }
    public interface IRepository
    {
        (bool Status, string Message) AddToCart(long customerId, long productDtId, int quantity);
        Task<SingleProductDetailsResponse> GetProductDetailsAsync(long productId);
       
    }
    public interface ICartRepository
    {
        void UpdateCart(CartUpdate model);
    }

    public interface IMemberRepository
    {
        void UpdateMember(MemberId model);
    }
    public interface IAddressRepository
    {
        bool CreateAddress(AddressCreateRequest request);
    }
    public interface IDeleteAddressRepository
    {
        // Other method signatures...

        bool DeleteAddress(int customerAddressId ,int addressId );
    }
    public interface IUpdateAddressRepository
    {
        bool UpdateAddress(AddressUpdateRequest request);
    }


    // Interfaces/IOrderRepository.cs
    public interface ICreateOrderRepository
    {
        Task<OrderCreateResult> CreateOrderAsync(OrderCreateRequest request);
    }

    public interface IOrderInvoiceRepository
    {
        Task<InvoiceResponse> GetOrderInvoiceAsync(long orderId);
    }

    public interface ICustomerOrderRepository
    {
        IEnumerable<OrderCustomerDetails> GetOrdersByCustomerId(int customerId);
    }
    public interface IGetPaymentMethodRepository
    {
        // Other method signatures

        List<GetPaymentMethod> GetProductOrderPaymentMethods();
    }
    public interface IOrderStatusDetailsRepository
    {
        // Other method signatures

        List<OrderStatusDetails> GetProductOrderStatuses();
    }
    public interface IOrderDetailsByCustomerRepository
    {
        List<OrderDetailsCustomer> GetOrderDetailsByCustomer(int orderId);
    }
  
    public interface ICustomerAddressRepository
    {
        Task<IEnumerable<GetCustomerAddress>> GetCustomerAddressesAsync(long customerId);
    }

    public interface ICountryRepository
    {
        Task<IEnumerable<Country>> GetCountryAsync();
    }
    public interface IStateRepository
    {
        Task<IEnumerable<State>> GetStatesByCountryAsync(int countryId);
    }
    public interface ICustmerOrderDetailsRepository
    {
        Task<IEnumerable<CustomerOrderDetails>> GetCustomerOrdersAsync(int customerId);
    }
    public interface IWalletRepository
    {
        Task<WalletResponseModel> CreditDebitWalletAsync(WalletTransactionModel model);
    }

    public interface IChangedPasswordRepository
    {
        Task<PasswordChangeResponseModel> ChangePasswordAsync(PasswordChangeRequestModel model);
    }
    public interface IOrderStatusUpdateRepository
    {
        bool UpdateOrderStatus(OrderUpdateResponseModel model, out string message);
    }
    public interface IOtpRepository
    {
        Task<int> InsertOtpAsync(OtpEntry otpEntry);
        Task<bool> VerifyOtpAsync(string emailId, string otp);
     //   Task DeleteVerifiedOtpsAsync();
    }

    public interface IForgotPasswordRepository
    {
        // Other existing methods

        ForgotPasswordResponse ForgotPassword(string emailId);
    }

}



