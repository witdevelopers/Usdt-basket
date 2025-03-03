using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using Api.Shop.Models;
using static IShopRepository;
using System.Linq;
using Org.BouncyCastle.Asn1.X509;
using System.Text;
using Api.Utilities;
using TronNet.Protocol;

namespace Api.Shop.Repositories
{
    public class Repository : IBannerRepository, ICategoryRepository, IParentCategoryRepository, IGetProductForCategoryRepository, IGetShoppingCartRepository, IHomePageProductsRepository, IHomePageProductsBySectionIdRepository, IHomeProductRepository, IProductDetailsRepository, IProductImageRepository, IProductListRepository, IRemoveCartRepository, ISearchProductRepository, ICustomerAddressRepository, IAddressRepository, IDeleteAddressRepository, IUpdateAddressRepository, ICreateOrderRepository, IOrderInvoiceRepository, IGetPaymentMethodRepository, IOrderStatusDetailsRepository, ICustomerOrderRepository, IOrderDetailsByCustomerRepository, ICountryRepository, ICustmerOrderDetailsRepository, IWalletRepository, IChangedPasswordRepository , IMemberRepository , IOrderStatusUpdateRepository , IOtpRepository , IForgotPasswordRepository
        , IStateRepository
    {
        private readonly string _connectionString;

        public Repository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("connectionString");
        }

        // Banner Repository Methods
        public async Task<IEnumerable<Banner>> GetBannersAsync()
        {
            var banners = new List<Banner>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("USP_Get_HomePage_Banners", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        banners.Add(new Banner
                        {
                            Id = reader.GetInt32(0),
                            ImageUrl = reader.GetString(1),
                            Caption = reader.IsDBNull(2) ? null : reader.GetString(2),
                            LandingUrl = reader.IsDBNull(3) ? null : reader.GetString(3),
                            DisplayOrder = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                            CreationDate = reader.GetDateTime(5),
                            CreatedBy = reader.GetInt32(6)
                        });
                    }
                }
            }

            return banners;
        }

        // Category Repository Methods
        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var categories = await connection.QueryAsync<Category>("USP_GetCategories", commandType: CommandType.StoredProcedure);
                return categories;
            }
        }

        public async Task<IEnumerable<ParentCategory>> GetAllParentCategoriesAsync()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var categories = await connection.QueryAsync<ParentCategory>("USP_GetParentCategories", commandType: CommandType.StoredProcedure);
                return categories;
            }
        }

        public async Task<IEnumerable<Category>> GetCategoryByIdAsync(int categoryId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new { CategoryId = categoryId };
                var category = await connection.QueryAsync<Category>("USP_GetCategories", parameters, commandType: CommandType.StoredProcedure);
                return category;
            }
        }
        // Get_Customer_Address Repository Methods
        //public Get_Customer_Address GetMemberInfoByCustomerId(long customerId)
        //{
        //    Get_Customer_Address getcustomerInfo = null;

        //    using (SqlConnection conn = new SqlConnection(_connectionString))
        //    {
        //        SqlCommand cmd = new SqlCommand("USP_Address_Get", conn);
        //        cmd.CommandType = CommandType.StoredProcedure;
        //        cmd.Parameters.AddWithValue("@CustomerId", customerId);

        //        conn.Open();
        //        using (SqlDataReader reader = cmd.ExecuteReader())
        //        {
        //            if (reader.Read())
        //            {
        //                getcustomerInfo = new Get_Customer_Address
        //                {
        //                    Srno = reader.GetInt64(reader.GetOrdinal("Srno")),
        //                    MemberId = reader.GetInt64(reader.GetOrdinal("MemberId")),
        //                    Title = reader["Title"] as string,
        //                    FirstName = reader["FirstName"] as string,
        //                    MiddleName = reader["MiddleName"] as string,
        //                    LastName = reader["LastName"] as string,
        //                    DateOfBirth = reader["DateOfBirth"] as DateTime?,
        //                    Gender = reader.GetString(reader.GetOrdinal("Gender"))[0],
        //                    Address = reader["Address"] as string,
        //                    District = reader["District"] as string,
        //                    State = reader.GetInt32(reader.GetOrdinal("State")),
        //                    Country = reader.GetInt32(reader.GetOrdinal("Country")),
        //                    Pincode = reader["Pincode"] as string,
        //                    MobileNo = reader["MobileNo"] as string,
        //                    EmailId = reader["EmailId"] as string,
        //                    ProfileImage = reader["ProfileImage"] as string
        //                };
        //            }
        //        }
        //    }

        //    return getcustomerInfo;
        //}

        // Get_Product_For_Category Repository Methods
        public DataSet GetProductsForCategory(int categoryId)
        {
            DataSet ds = new DataSet();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_Get_Product_ForCategory", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CategoryId", categoryId);

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(ds);
                }
            }
            return ds;
        }

        // GetShoppingCart Repository Methods
        public (List<GetShoppingCartItem> Items, GetCartSummary Summary) GetCartByCustomerId(long customerId)
        {
            var items = new List<GetShoppingCartItem>();
            GetCartSummary summary = null;

            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                // Fetch Cart Items
                using (var command = new SqlCommand("USP_Cart_Get", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@CustomerId", customerId);

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            items.Add(new GetShoppingCartItem
                            {
                                CartId = reader.GetInt64(reader.GetOrdinal("CartId")),
                                CustomerId = reader.GetInt64(reader.GetOrdinal("CustomerId")),
                                ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                                Quantity = reader.GetInt32(reader.GetOrdinal("Quantity")),
                                Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                                DiscountPrice = reader.GetDecimal(reader.GetOrdinal("DiscountPrice")),
                                BV = reader.GetDecimal(reader.GetOrdinal("BV")),
                                ProductDtId = reader.GetInt64(reader.GetOrdinal("ProductDtId")),
                                ImageUrl = reader.GetString(reader.GetOrdinal("ImageUrl")),
                                ProductId = reader.GetInt64(reader.GetOrdinal("ProductId")),
                                //SizeId=reader.GetInt64(reader.GetOrdinal("SizeId")),
                                //Size = reader.GetString(reader.GetOrdinal("Size")),
                                ActiveStatus = reader.GetInt32(reader.GetOrdinal("Active_Status")),
                                StockStatus = reader.GetInt32(reader.GetOrdinal("Stock_Status"))
                            });
                        }

                        // Move to the next result set for the summary
                        if (reader.NextResult())
                        {
                            if (reader.Read())
                            {
                                summary = new GetCartSummary
                                {
                                    PriceTotal = reader.GetDecimal(reader.GetOrdinal("Price_Total")),
                                    DiscountPriceTotal = reader.GetDecimal(reader.GetOrdinal("DiscountPrice_Total")),
                                    BVTotal = reader.GetDecimal(reader.GetOrdinal("BV_Total"))
                                };
                            }
                        }
                    }
                }
            }

            return (items, summary);
        }

        // HomePageProducts Repository Methods
        public async Task<IEnumerable<HomePageProduct>> GetHomePageProductsAsync()
        {
            var products = new List<HomePageProduct>();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("USP_Get_HomePage_Products", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var product = new HomePageProduct
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    SectionId = reader.GetInt32(reader.GetOrdinal("SectionId")),
                                    SectionName = reader.IsDBNull(reader.GetOrdinal("SectionName")) ? null : reader.GetString(reader.GetOrdinal("SectionName")),
                                    ProductId = reader.GetInt64(reader.GetOrdinal("ProductId")),
                                    DisplayOrder = reader.GetInt32(reader.GetOrdinal("DisplayOrder")),
                                    Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Price")),
                                    DiscountPrice = reader.IsDBNull(reader.GetOrdinal("DiscountPrice")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("DiscountPrice")),
                                    DiscountPercentage = reader.IsDBNull(reader.GetOrdinal("DiscountPercentage")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("DiscountPercentage")),
                                    ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                    ProductName = reader.GetString(reader.GetOrdinal("ProductName")),
                                    HasVariant = reader.GetBoolean(reader.GetOrdinal("HasVariant")),
                                    CreatedOn = reader.GetDateTime(reader.GetOrdinal("CreatedOn"))
                                };

                                products.Add(product);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                // Example: _logger.LogError(ex, "An error occurred while fetching home page products.");
                throw; // Rethrow or handle the exception as needed
            }

            return products;
        }




        public async Task<IEnumerable<HomePageProduct>> GetHomePageProductsAsync(int sectionId)
        {
            var products = new List<HomePageProduct>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("USP_Get_HomePage_Products_From_SectionId", connection)
                {
                    CommandType = CommandType.StoredProcedure
                })
                {
                    command.Parameters.AddWithValue("@SectionId", sectionId);

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        var dataTable = new DataTable();
                        adapter.Fill(dataTable);

                        foreach (DataRow row in dataTable.Rows)
                        {
                            var product = new HomePageProduct
                            {
                                Id = Convert.ToInt32(row["Id"]),
                                SectionId = Convert.ToInt32(row["SectionId"]),
                                SectionName = row["SectionName"].ToString(),
                                ProductId = Convert.ToInt32(row["ProductId"]),
                                DisplayOrder = Convert.ToInt32(row["DisplayOrder"]),
                                DiscountPrice = row.IsNull("DiscountPrice") ? (int?)null : row.Field<int>("DiscountPrice"),  // Use decimal for 
                                ImageUrl = row.IsNull("ImageUrl") ? null : row["ImageUrl"].ToString(),
                                ProductName = row["ProductName"].ToString(),
                                HasVariant = Convert.ToBoolean(row["HasVariant"]),
                                CreatedOn = Convert.ToDateTime(row["CreatedOn"])
                            };

                            products.Add(product);
                        }
                    }
                }
            }

            return products;
        }


        // HomeProduct Repository Methods
        public async Task<IEnumerable<HomeProduct>> GetHomePageSectionsAsync()
        {
            var sections = new List<HomeProduct>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("USP_Get_HomePage_Sections", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        sections.Add(new HomeProduct
                        {
                            Id = reader.GetInt32(0),
                            SectionName = reader.GetString(1),
                            IsActive = reader.GetBoolean(2),
                            CreatedOn = reader.GetDateTime(3)
                        });
                    }
                }
            }

            return sections;
        }

        // ProductDetails Repository Methods
        public async Task<IEnumerable<ProductDetails>> GetProductDetailsAsync()
        {
            var productDetailsList = new List<ProductDetails>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("SELECT * FROM vw_Product_Details_Customer", connection))
                {
                    using (var adapter = new SqlDataAdapter(command))
                    {
                        var dataTable = new DataTable();
                        adapter.Fill(dataTable);

                        foreach (DataRow row in dataTable.Rows)
                        {
                            var productDetails = new ProductDetails
                            {
                                ProductId = Convert.ToInt64(row["ProductId"]),
                                ProductName = row["ProductName"].ToString(),
                                Name = row["Name"].ToString(),
                                ProductDtId = Convert.ToInt64(row["ProductDtId"]),
                                SKUCode = row["SKUCode"].ToString(),
                                Price = Convert.ToDecimal(row["Price"]),
                                DiscountPrice = row.IsNull("DiscountPrice") ? (decimal?)null : Convert.ToDecimal(row["DiscountPrice"]),
                                DiscountPercentage = row.IsNull("DiscountPercentage ") ? (decimal?)null : Convert.ToDecimal(row["DiscountPercentage "]),
                                BV = Convert.ToDecimal(row["BV"]),
                                CreatedOn = Convert.ToDateTime(row["CreatedOn"]),
                                IsActive = Convert.ToBoolean(row["IsActive"]),
                                ModifiedOn = row.IsNull("ModifiedOn") ? (DateTime?)null : Convert.ToDateTime(row["ModifiedOn"]),
                                //Size = row["Size"] != DBNull.Value ? row["Size"].ToString() : null,
                                //SizeId = row["SizeId"] != DBNull.Value ? (long)row["SizeId"] : 0,
                                Stock = Convert.ToInt32(row["Stock"]),
                                StockUpdatedOn = row.IsNull("StockUpdatedOn") ? (DateTime?)null : Convert.ToDateTime(row["StockUpdatedOn"])
                            };

                            productDetailsList.Add(productDetails);
                        }
                    }
                }
            }

            return productDetailsList;
        }

        // ProductImage Repository Methods
        public async Task<ProductImageDetails> GetProductDetailsByIdAsync(int productId)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var parameters = new { ProductId = productId };
                return await db.QueryFirstOrDefaultAsync<ProductImageDetails>(
                    "USP_GetProductDetailsById",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }

        // ProductList Repository Methods
        public async Task<IEnumerable<ProductList>> GetProductsByCategoryIdAsync(int categoryId)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var parameters = new { CategoryId = categoryId };
                return await db.QueryAsync<ProductList>(
                    "USP_GetProductsByCategoryId",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );
            }
        }

        // RemoveCart Repository Methods
        public RemoveCartResponse RemoveFromCart(long customerId, long productDtId, bool removeAll )
        {
            var response = new RemoveCartResponse();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("USP_Cart_Remove", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@CustomerId", customerId);
                    command.Parameters.AddWithValue("@ProductDtId", productDtId);
                    command.Parameters.AddWithValue("@RemoveAll", removeAll);
                   // command.Parameters.AddWithValue("@SizeId", SizeId);


                    connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            response.Status = Convert.ToBoolean(reader["Status"]);
                            response.Message = reader["Message"].ToString();
                        }
                    }
                }
            }

            return response;
        }

        // SearchProduct Repository Methods
        public List<SearchProductResponse> SearchProductsByKeyword(string keyword)
        {
            var products = new List<SearchProductResponse>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("USP_Search_Products_By_Keyword", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Keyword", keyword);

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        var dataTable = new DataTable();
                        adapter.Fill(dataTable);

                        foreach (DataRow row in dataTable.Rows)
                        {
                            products.Add(new SearchProductResponse
                            {
                                ProductId = Convert.ToInt64(row["ProductId"]),
                                ProductName = row["ProductName"].ToString()
                            });
                        }
                    }
                }
            }

            return products;
        }
        #region ShoppingCartRepository Methods

        public (bool Status, string Message) AddToCart(long customerId, long productDtId, int quantity)
        {
            bool status = false;
            string message = string.Empty;

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("USP_Cart_Add", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@CustomerId", customerId);
                    command.Parameters.AddWithValue("@ProductDtId", productDtId);
                    command.Parameters.AddWithValue("@Quantity", quantity);
                  //  command.Parameters.AddWithValue("@SizeId", sizeId);

                    try
                    {
                        connection.Open();
                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                status = reader.GetBoolean(reader.GetOrdinal("Status"));
                                message = reader.GetString(reader.GetOrdinal("Message"));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // Handle logging or other error handling as needed
                        message = "Some Error Occurred!!!";
                    }
                }
            }

            return (status, message);
        }

        #endregion

        #region SingleProductRepositories Methods

        public async Task<SingleProductDetailsResponse> GetProductDetailsAsync(long productId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    using (var command = new SqlCommand("USP_Get_Product_Details_Customer", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@ProductId", productId);

                        var dataSet = new DataSet();
                        using (var adapter = new SqlDataAdapter(command))
                        {
                            await connection.OpenAsync();
                            adapter.Fill(dataSet);
                        }

                        var response = new SingleProductDetailsResponse();

                        // Map SingleProduct (vw_Product_Customer)
                        if (dataSet.Tables[0].Rows.Count > 0)
                        {
                            var productRow = dataSet.Tables[0].Rows[0];
                            response.SingleProduct = new SingleProduct
                            {
                                ProductId = (long)productRow["ProductId"],
                                ProductName = productRow["ProductName"].ToString(),
                                CategoryId = (int)productRow["CategoryId"],
                                CategoryName = productRow["CategoryName"].ToString(),
                                BrandId = (int)productRow["BrandId"],
                                BrandName = productRow["BrandName"].ToString(),
                                Description = productRow["Description"].ToString(),
                                HasVariant = (bool)productRow["HasVariant"],
                                CreatedOn = productRow["CreatedOn"] != DBNull.Value ? (DateTime)productRow["CreatedOn"] : DateTime.MinValue,
                                CreatedBy = productRow["CreatedBy"].ToString(),
                                IsActive = (bool)productRow["IsActive"],
                                ModifiedOn = productRow["ModifiedOn"] != DBNull.Value ? (DateTime?)productRow["ModifiedOn"] : null,
                                ModifiedBy = productRow["ModifiedBy"] != DBNull.Value ? productRow["ModifiedBy"].ToString() : null
                            };
                        }

                        // Map SingleProductDetails (vw_Product_Details_Customer)
                        if (dataSet.Tables[1].Rows.Count > 0)
                        {
                            response.SingleProductDetails = dataSet.Tables[1].AsEnumerable().Select(row => new SingleProductDetails
                            {
                                ProductId = (long)row["ProductId"],
                                ProductName = row["ProductName"].ToString(),
                                ProductDtId = (long)row["ProductDtId"],
                                SKUCode = row["SKUCode"].ToString(),
                                Price = (decimal)row["Price"],
                                DiscountPrice = (decimal)row["DiscountPrice"],
                                DiscountPercentage = (decimal)row["DiscountPercentage"],
                                BV = (decimal)row["BV"],
                                CreatedOn = row["CreatedOn"] != DBNull.Value ? (DateTime)row["CreatedOn"] : DateTime.MinValue,
                                IsActive = (bool)row["IsActive"],
                                ModifiedOn = row["ModifiedOn"] != DBNull.Value ? (DateTime?)row["ModifiedOn"] : null,
                               // Size = row["Size"] != DBNull.Value ? row["Size"].ToString() : null,
                             //  SizeId = row["SizeId"] != DBNull.Value ? (long)row["SizeId"] : 0,
                                Stock = row["Stock"] != DBNull.Value ? (int)row["Stock"] : 0,
                                StockUpdatedOn = row["StockUpdatedOn"] != DBNull.Value ? (DateTime?)row["StockUpdatedOn"] : null
                            }).ToList();
                        }

                        // Map SingleProductAttributes (vw_Product_Attributes)
                        if (dataSet.Tables[2].Rows.Count > 0)
                        {
                            response.SingleProductAttributes = dataSet.Tables[2].AsEnumerable().Select(row => new SingleProductAttributes
                            {
                                Id = (long)row["Id"],
                                ProductId = (long)row["ProductId"],
                                ProductDtId = (long)row["ProductDtId"],
                                Attribute = row["Attribute"].ToString(),
                                AttributeValue = row["AttributeValue"].ToString()
                            }).ToList();
                        }

                        // Map SingleProductImages (vw_Product_Image)
                        if (dataSet.Tables[3].Rows.Count > 0)
                        {
                            response.SingleProductImages = dataSet.Tables[3].AsEnumerable().Select(row => new SingleProductImage
                            {
                                Id = (long)row["Id"],
                                ProductId = (long)row["ProductId"],
                                ProductName = row["ProductName"].ToString(),
                                ProductDtId = (long)row["ProductDtId"],
                                SKUCode = row["SKUCode"].ToString(),
                                ImageUrl = row["ImageUrl"].ToString(),
                                RelativeUrl = row["RelativeUrl"].ToString(),
                                IsMainImage = (bool)row["IsMainImage"],
                                CreatedOn = row["CreatedOn"] != DBNull.Value ? DateTime.Parse(row["CreatedOn"].ToString()) : DateTime.MinValue
                            }).ToList();
                        }

                        //if (dataSet.Tables[4].Rows.Count > 0)
                        //{
                        //    response.SingleProductSize = dataSet.Tables[4].AsEnumerable().Select(row => new SingleProductSize
                        //    {
                        //        Id = (long)row["Id"],
                        //        ProductId = (long)row["ProductId"],
                        //        ProductDtId = (long)row["ProductId"],
                        //        SizeDescription =  row["SizeDescription"] != DBNull.Value ? row["SizeDescription"].ToString() : null,
                        //        IsActive = (bool)row["IsActive"],
                        //        CreatedBy = row["CreatedBy"] != DBNull.Value ? (int)row["CreatedBy"] : 0,
                        //        SKUCode = row["SKUCode"].ToString(),
                        //        CreatedDate = row["CreatedDate"] != DBNull.Value ? DateTime.Parse(row["CreatedDate"].ToString()) : DateTime.MinValue
                        //    }).ToList();
                        //}


                        return response;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching product details: " + ex.Message, ex);
            }
        }




        #endregion

        #region UpdateCartRepository Methods

        public void UpdateCart(CartUpdate model)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.USP_Cart_Update", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Add parameters using the model
                        cmd.Parameters.AddWithValue("@CustomerId", model.CustomerId);
                       
                        cmd.Parameters.AddWithValue("@ProductDtId", model.ProductDtId);
                        cmd.Parameters.AddWithValue("@Quantity", model.Quantity);
                      //  cmd.Parameters.AddWithValue("@SizeId", model.SizeId);

                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Handle SQL exceptions
                throw new Exception("An error occurred while updating the cart in the database.", sqlEx);
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                throw new Exception("An unexpected error occurred while updating the cart.", ex);
            }
        }



        public void UpdateMember(MemberId model)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.USP_Member_Update", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Add parameters using the model
                        cmd.Parameters.AddWithValue("@CustomerId", model.CustomerId);
                        cmd.Parameters.AddWithValue("@CustomerId_NewMember", model.CustomerId_NewMember);


                        conn.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                // Handle SQL exceptions
                throw new Exception("An error occurred while updating the cart in the database.", sqlEx);
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                throw new Exception("An unexpected error occurred while updating the cart.", ex);
            }
        }
        #endregion

        public async Task<IEnumerable<GetCustomerAddress>> GetCustomerAddressesAsync(long customerId)
        {
            var addresses = new List<GetCustomerAddress>();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("[dbo].[USP_Address_Get]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@CustomerId", customerId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var address = new GetCustomerAddress
                                {
                                    CustomerId = reader.IsDBNull(reader.GetOrdinal("CustomerId")) ? 0 : Convert.ToInt64(reader["CustomerId"]),
                                    AddressId = reader.IsDBNull(reader.GetOrdinal("AddressId")) ? 0 : Convert.ToInt32(reader["AddressId"]),
                                    FullName = reader.IsDBNull(reader.GetOrdinal("FullName")) ? null : reader.GetString(reader.GetOrdinal("FullName")),
                                    Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? null : reader.GetString(reader.GetOrdinal("Phone")),
                                    Address1 = reader.IsDBNull(reader.GetOrdinal("Address1")) ? null : reader.GetString(reader.GetOrdinal("Address1")),
                                    Address2 = reader.IsDBNull(reader.GetOrdinal("Address2")) ? null : reader.GetString(reader.GetOrdinal("Address2")),
                                    Address3 = reader.IsDBNull(reader.GetOrdinal("Address3")) ? null : reader.GetString(reader.GetOrdinal("Address3")),
                                    PostalCode = reader.IsDBNull(reader.GetOrdinal("PostalCode")) ? null : reader.GetString(reader.GetOrdinal("PostalCode")),
                                    CityName = reader.IsDBNull(reader.GetOrdinal("CityName")) ? null : reader.GetString(reader.GetOrdinal("CityName")),
                                    StateId = reader.IsDBNull(reader.GetOrdinal("StateId")) ? 0 : Convert.ToInt32(reader["StateId"]),
                                    StateName = reader.IsDBNull(reader.GetOrdinal("StateName")) ? null : reader.GetString(reader.GetOrdinal("StateName")),
                                    CountryId = reader.IsDBNull(reader.GetOrdinal("CountryId")) ? 0 : Convert.ToInt32(reader["CountryId"]),
                                    CountryName = reader.IsDBNull(reader.GetOrdinal("CountryName")) ? null : reader.GetString(reader.GetOrdinal("CountryName")),
                                    AddressTypeId = reader.IsDBNull(reader.GetOrdinal("AddressTypeId")) ? 0 : Convert.ToInt32(reader["AddressTypeId"]),
                                    AddressType = reader.IsDBNull(reader.GetOrdinal("AddressType")) ? null : reader.GetString(reader.GetOrdinal("AddressType")),
                                    IsActive = reader.IsDBNull(reader.GetOrdinal("IsActive")) ? false : reader.GetBoolean(reader.GetOrdinal("IsActive")),
                                    CreatedOn = reader.IsDBNull(reader.GetOrdinal("CreatedOn")) ? default(DateTime) : reader.GetDateTime(reader.GetOrdinal("CreatedOn"))
                                };

                                addresses.Add(address);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                throw new ApplicationException($"An error occurred while retrieving customer addresses: {ex.Message}", ex);
            }

            return addresses;
        }


        public bool CreateAddress(AddressCreateRequest request)
        {
            bool isSuccess = false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("[dbo].[USP_Address_Create]", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameters for the stored procedure
                    cmd.Parameters.AddWithValue("@CustomerId", request.CustomerId);
                    cmd.Parameters.AddWithValue("@Name", request.Name);
                    cmd.Parameters.AddWithValue("@Phone", request.Phone);
                    cmd.Parameters.AddWithValue("@Address1", request.Address1);
                    cmd.Parameters.AddWithValue("@Address2", request.Address2);
                    cmd.Parameters.AddWithValue("@Address3", request.Address3);
                    cmd.Parameters.AddWithValue("@PostalCode", request.PostalCode);
                    cmd.Parameters.AddWithValue("@CityName", request.CityName);
                    cmd.Parameters.AddWithValue("@StateId", request.StateId);
                    cmd.Parameters.AddWithValue("@CountryId", request.CountryId);
                    cmd.Parameters.AddWithValue("@AddressType", request.AddressType);
                    cmd.Parameters.AddWithValue("@IsActive", request.IsActive);
                    cmd.Parameters.AddWithValue("@CreatedOn", request.CreatedOn);

                    conn.Open();

                    try
                    {
                        cmd.ExecuteNonQuery();
                        isSuccess = true; // If the command executes successfully, set the flag to true.
                    }
                    catch (Exception)
                    {
                        isSuccess = false; // If any error occurs, set the flag to false.
                    }
                }
            }

            return isSuccess;
        }
        public bool DeleteAddress(int customerAddressId, int addressId)
        {
            bool isSuccess = false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("[dbo].[USP_Address_Delete]", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameter for the stored procedure
                    cmd.Parameters.AddWithValue("@CustomerAddressId", customerAddressId);
                    cmd.Parameters.AddWithValue("@AddressId", addressId);

                    conn.Open();

                    try
                    {
                        cmd.ExecuteNonQuery();
                        isSuccess = true; // If the command executes successfully, set the flag to true.
                    }
                    catch (Exception)
                    {
                        isSuccess = false; // If any error occurs, set the flag to false.
                    }
                }
            }

            return isSuccess;
        }

        public bool UpdateAddress(AddressUpdateRequest request)
        {
            bool isSuccess = false;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("[dbo].[USP_Address_Update]", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parameters for the stored procedure
                    cmd.Parameters.AddWithValue("@AddressId", request.AddressId);
                    cmd.Parameters.AddWithValue("@CustomerId", request.CustomerId);
                    cmd.Parameters.AddWithValue("@Name", request.Name);
                    cmd.Parameters.AddWithValue("@Phone", request.Phone);
                    cmd.Parameters.AddWithValue("@Address1", request.Address1);
                    cmd.Parameters.AddWithValue("@Address2", request.Address2);
                    cmd.Parameters.AddWithValue("@Address3", request.Address3);
                    cmd.Parameters.AddWithValue("@PostalCode", request.PostalCode);
                    cmd.Parameters.AddWithValue("@CityName", request.CityName);
                    cmd.Parameters.AddWithValue("@StateId", request.StateId);
                    cmd.Parameters.AddWithValue("@CountryId", request.CountryId);
                    cmd.Parameters.AddWithValue("@AddressType", request.AddressType);
                    cmd.Parameters.AddWithValue("@IsActive", request.IsActive); // Added field


                    conn.Open();

                    try
                    {
                        cmd.ExecuteNonQuery();
                        isSuccess = true; // If the command executes successfully, set the flag to true.
                    }
                    catch (Exception)
                    {
                        isSuccess = false; // If any error occurs, set the flag to false.
                    }
                }
            }

            return isSuccess;
        }

        public async Task<OrderCreateResult> CreateOrderAsync(OrderCreateRequest request)
        {
            var orderResponse = new OrderCreateResult();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("USP_Order_Create", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@CustomerId", request.CustomerId);
                    command.Parameters.AddWithValue("@AddressId", request.AddressId);
                    command.Parameters.AddWithValue("@Remarks", request.Remarks);

                    // Prepare OrderPayment Table
                    var orderPaymentTable = new DataTable();
                    orderPaymentTable.Columns.Add("OrderId", typeof(string));
                    orderPaymentTable.Columns.Add("TransactionId", typeof(string));
                    orderPaymentTable.Columns.Add("PaymentMethodId", typeof(int));
                    orderPaymentTable.Columns.Add("PaymentStatus", typeof(string));
                    orderPaymentTable.Columns.Add("PaymentStatusId", typeof(int));
                    orderPaymentTable.Columns.Add("AmountPaid", typeof(decimal));
                    orderPaymentTable.Columns.Add("OnDate", typeof(DateTime));

                    foreach (var payment in request.OrderPayments)
                    {
                        orderPaymentTable.Rows.Add(payment.OrderId, payment.TransactionId, payment.PaymentMethodId,
                                                    payment.PaymentStatus, payment.PaymentStatusId,
                                                    payment.AmountPaid, payment.OnDate);
                    }

                    var orderPaymentParam = new SqlParameter("@OrderPayment", orderPaymentTable)
                    {
                        SqlDbType = SqlDbType.Structured,
                        TypeName = "dbo.OrderPayment"
                    };
                    command.Parameters.Add(orderPaymentParam);

                    // Output Parameters
                    var statusParam = new SqlParameter("@Status", SqlDbType.Bit) { Direction = ParameterDirection.Output };
                    var statusWalletParam = new SqlParameter("@Status_Wallet", SqlDbType.Bit) { Direction = ParameterDirection.Output };
                    var msgParam = new SqlParameter("@Msg", SqlDbType.VarChar, 100) { Direction = ParameterDirection.Output };
                    var orderNoParam = new SqlParameter("@OrderNo", SqlDbType.VarChar, 50) { Direction = ParameterDirection.Output };
                    var orderIdParam = new SqlParameter("@OrderId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

                    command.Parameters.Add(statusParam);
                    command.Parameters.Add(statusWalletParam);
                    command.Parameters.Add(msgParam);
                    command.Parameters.Add(orderNoParam);
                    command.Parameters.Add(orderIdParam);

                    await command.ExecuteNonQueryAsync();

                    // Read Output Parameters
                    orderResponse.Status = (bool)statusParam.Value;
                    orderResponse.StatusWallet = (bool)statusWalletParam.Value;
                    orderResponse.Message = msgParam.Value.ToString();
                    orderResponse.OrderNo = orderNoParam.Value.ToString();
                    orderResponse.OrderId = (long)orderIdParam.Value;
                }
            }

            return orderResponse;
        }
        public async Task<InvoiceResponse> GetOrderInvoiceAsync(long orderId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var multi = await connection.QueryMultipleAsync("[dbo].[USP_Order_Invoice]",
                    new { OrderId = orderId }, commandType: CommandType.StoredProcedure))
                {
                    var order = await multi.ReadFirstOrDefaultAsync<OrderInvoiceRequest>();
                    var orderDetails = (await multi.ReadAsync<InvoiceOrderDetail>()).ToList();
                    var payments = (await multi.ReadAsync<InvoiceOrderPayment>()).ToList();
                    var address = await multi.ReadFirstOrDefaultAsync<InvoiceAddress>();

                    return new InvoiceResponse
                    {
                        Order = order,
                        OrderDetails = orderDetails,
                        Payments = payments,
                        ShippingAddress = address
                    };
                }
            }
        }

        public IEnumerable<OrderCustomerDetails> GetOrdersByCustomerId(int customerId)
        {
            var orders = new List<OrderCustomerDetails>();

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("USP_Order_Get_Customer", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@CustomerId", customerId);

                    connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            orders.Add(new OrderCustomerDetails
                            {
                                Srno = reader.GetInt32(reader.GetOrdinal("Srno")),
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                OrderNo = reader.GetString(reader.GetOrdinal("OrderNo")),
                                CustomerId = reader.GetInt32(reader.GetOrdinal("CustomerId")),
                                BillingAddressId = reader.GetInt32(reader.GetOrdinal("BillingAddressId")),
                                ShippingAddressId = reader.GetInt32(reader.GetOrdinal("ShippingAddressId")),
                                OrderDate = reader.GetString(reader.GetOrdinal("OrderDate")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                OrderAmount = reader.GetDecimal(reader.GetOrdinal("OrderAmount")),
                                IsDelivered = reader.GetBoolean(reader.GetOrdinal("IsDelivered")),
                                DeliveredOn = reader.IsDBNull(reader.GetOrdinal("DeliveredOn")) ? null : reader.GetString(reader.GetOrdinal("DeliveredOn")),
                                IsCouponApplied = reader.GetBoolean(reader.GetOrdinal("IsCouponApplied")),
                                CouponId = reader.IsDBNull(reader.GetOrdinal("CouponId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("CouponId")),
                                CouponAmount = reader.GetDecimal(reader.GetOrdinal("CouponAmount")),
                                Remarks = reader.GetString(reader.GetOrdinal("Remarks")),
                                PaymentMethod = reader.GetString(reader.GetOrdinal("PaymentMethod"))
                            });
                        }
                    }
                }
            }

            return orders;
        }
        public List<GetPaymentMethod> GetProductOrderPaymentMethods()
        {
            List<GetPaymentMethod> paymentMethods = new List<GetPaymentMethod>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_Get_Product_Order_PaymentMethod", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    con.Open();
                    da.Fill(dt);
                    con.Close();

                    foreach (DataRow row in dt.Rows)
                    {
                        GetPaymentMethod paymentMethod = new GetPaymentMethod
                        {
                            Id = Convert.ToInt32(row["Id"]),
                            PaymentMethod = row["PaymentMethod"].ToString()
                        };
                        paymentMethods.Add(paymentMethod);
                    }
                }
            }

            return paymentMethods;
        }
        public List<OrderStatusDetails> GetProductOrderStatuses()
        {
            List<OrderStatusDetails> orderStatuses = new List<OrderStatusDetails>();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_Get_Product_Order_Status", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    DataTable dt = new DataTable();
                    con.Open();
                    da.Fill(dt);
                    con.Close();

                    foreach (DataRow row in dt.Rows)
                    {
                        OrderStatusDetails orderStatus = new OrderStatusDetails
                        {
                            Id = Convert.ToInt32(row["Id"]),
                            OrderStatus = row["OrderStatus"].ToString()
                        };
                        orderStatuses.Add(orderStatus);
                    }
                }
            }

            return orderStatuses;
        }
        public List<OrderDetailsCustomer> GetOrderDetailsByCustomer(int orderId)
        {
            var orderDetailsList = new List<OrderDetailsCustomer>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_Order_Details_Get_Customer", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@OrderId", orderId);

                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    while (reader.Read())
                    {
                        var orderDetails = new OrderDetailsCustomer
                        {
                            OrderId = reader["OrderId"] != DBNull.Value ? Convert.ToInt32(reader["OrderId"]) : (int?)null,
                            ProductName = reader["ProductName"].ToString(),
                            Quantity = reader["Quantity"] != DBNull.Value ? Convert.ToInt32(reader["Quantity"]) : (int?)null,
                            Price = reader["Price"] != DBNull.Value ? Convert.ToDecimal(reader["Price"]) : (decimal?)null,
                            BV = reader["BV"] != DBNull.Value ? Convert.ToDecimal(reader["BV"]) : (decimal?)null,
                            TotalAmount = reader["TotalAmount"] != DBNull.Value ? Convert.ToDecimal(reader["TotalAmount"]) : (decimal?)null,
                            TotalBV = reader["TotalBV"] != DBNull.Value ? Convert.ToDecimal(reader["TotalBV"]) : (decimal?)null
                        };
                        orderDetailsList.Add(orderDetails);
                    }
                }
            }

            return orderDetailsList;
        }

        public async Task<IEnumerable<Country>> GetCountryAsync()
        {
            var country = new List<Country>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("CountryList", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        country.Add(new Country
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),

                        });
                    }
                }
            }

            return country;
        }

        public async Task<IEnumerable<State>> GetStatesByCountryAsync(int countryId)
        {
            var states = new List<State>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("StateList", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };
                cmd.Parameters.AddWithValue("@CountryId", countryId);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        states.Add(new State
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            Name = reader.GetString(reader.GetOrdinal("Name")),
                            CountryId = reader.GetInt32(reader.GetOrdinal("CountryId")),
                            Code = reader.GetString(reader.GetOrdinal("Code")),
                            ADM1Code = reader.GetString(reader.GetOrdinal("ADM1Code")),
                            IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
                        });
                    }
                }
            }

            return states;
        }
        public async Task<IEnumerable<CustomerOrderDetails>> GetCustomerOrdersAsync(int customerId)
        {
            var orderDetails = new List<CustomerOrderDetails>();

            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("USP_Order_Get_Customer", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@CustomerId", customerId);

                try
                {
                    connection.Open();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (!reader.HasRows)
                        {
                            Console.WriteLine("No rows returned from the stored procedure.");
                            return orderDetails;
                        }

                        while (await reader.ReadAsync())
                        {
                            var orderDetail = new CustomerOrderDetails
                            {
                                Id = Convert.ToInt64(reader["Id"]),
                                ProductDtId = Convert.ToInt64(reader["ProductDtId"]),
                                OrderNo = reader.IsDBNull(reader.GetOrdinal("OrderNo"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("OrderNo")),
                                ProductName = reader.IsDBNull(reader.GetOrdinal("ProductName"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("ProductName")),
                                ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("ImageUrl")),
                                SingleProductOrderPrice = reader.GetDecimal(reader.GetOrdinal("SingleProductOrderPrice")),
                                SingleProductOrderStatus = reader.IsDBNull(reader.GetOrdinal("SingleProductOrderStatus"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("SingleProductOrderStatus")),
                                CustomerId = Convert.ToInt64(reader["CustomerId"]),
                                BillingAddressId = Convert.ToInt64(reader["BillingAddressId"]),
                                ShippingAddressId = Convert.ToInt64(reader["ShippingAddressId"]),
                                OrderDate = reader.IsDBNull(reader.GetOrdinal("OrderDate"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("OrderDate")),
                                Status = reader.IsDBNull(reader.GetOrdinal("Status"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Status")),
                                OrderAmount = reader.GetDecimal(reader.GetOrdinal("OrderAmount")),
                                IsDelivered = reader.IsDBNull(reader.GetOrdinal("IsDelivered"))
                                    ? (bool?)null
                                    : reader.GetBoolean(reader.GetOrdinal("IsDelivered")),
                                DeliveredOn = reader.IsDBNull(reader.GetOrdinal("DeliveredOn"))
                                    ? (DateTime?)null
                                    : reader.GetDateTime(reader.GetOrdinal("DeliveredOn")),
                                IsCouponApplied = reader.IsDBNull(reader.GetOrdinal("IsCouponApplied"))
                                    ? (bool?)null
                                    : reader.GetBoolean(reader.GetOrdinal("IsCouponApplied")),
                                CouponId = reader.IsDBNull(reader.GetOrdinal("CouponId"))
                                    ? (int?)null
                                    : reader.GetInt32(reader.GetOrdinal("CouponId")),
                                CouponAmount = reader.IsDBNull(reader.GetOrdinal("CouponAmount"))
                                    ? (decimal?)null
                                    : reader.GetDecimal(reader.GetOrdinal("CouponAmount")),
                                Remarks = reader.IsDBNull(reader.GetOrdinal("Remarks"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("Remarks")),
                                PaymentMethod = reader.IsDBNull(reader.GetOrdinal("PaymentMethod"))
                                    ? null
                                    : reader.GetString(reader.GetOrdinal("PaymentMethod"))
                            };

                            orderDetails.Add(orderDetail);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log the exception as needed
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    throw; // Rethrow or handle exception as needed
                }
            }

            return orderDetails;
        }
        public async Task<WalletResponseModel> CreditDebitWalletAsync(WalletTransactionModel model)
        {
            var response = new WalletResponseModel
            {
                Success = false,
                Message = "An error occurred."
            };

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand("USP_CreditDebitAmount_Wallet", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@UserId", model.UserId);
                        cmd.Parameters.AddWithValue("@WalletType", model.WalletType);
                        cmd.Parameters.AddWithValue("@Type", model.Type);
                        cmd.Parameters.AddWithValue("@Amount", model.Amount);
                        cmd.Parameters.AddWithValue("@Remarks", model.Remarks ?? string.Empty);
                        cmd.Parameters.AddWithValue("@ByAdminId", model.ByAdminId);

                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            if (reader.Read())
                            {
                                response.Message = reader["Message"].ToString();
                                response.Success = response.Message.Contains("successfully!");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Message = "Error: " + ex.Message;
                response.Success = false;
            }

            return response;
        }
        public async Task<PasswordChangeResponseModel> ChangePasswordAsync(PasswordChangeRequestModel model)
        {
            PasswordChangeResponseModel response = new PasswordChangeResponseModel();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_UpdatePassword", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@UserId", model.UserId);
                    cmd.Parameters.AddWithValue("@OldPassword", model.OldPassword);
                    cmd.Parameters.AddWithValue("@NewPassword", model.NewPassword);
                    cmd.Parameters.AddWithValue("@UserType", model.UserType);
                    cmd.Parameters.AddWithValue("@IsByAdmin", model.IsByAdmin);
                    cmd.Parameters.AddWithValue("@ByAdminId", model.ByAdminId);
                    cmd.Parameters.AddWithValue("@IsForgotPassword", model.IsForgotPassword);

                    conn.Open();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (reader.Read())
                        {
                            response.IsSuccess = reader["Valid"].ToString() == "True";
                            response.Message = reader["Message"].ToString();
                        }
                    }
                }
            }

            return response;
        }
        public bool UpdateOrderStatus(OrderUpdateResponseModel model, out string message)
        {
            bool status = false;
            message = string.Empty;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("USP_Order_Update", conn)
                {
                    CommandType = CommandType.StoredProcedure
                };

                // Add the necessary input parameters for the stored procedure
               
                cmd.Parameters.AddWithValue("@OrderId", model.OrderId);
                cmd.Parameters.AddWithValue("@ProductDtId", model.ProductDtId);
                cmd.Parameters.AddWithValue("@MemberId", model.MemberId);
                cmd.Parameters.AddWithValue("@OrderStatus", model.OrderStatus);
                cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);

                try
                {
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    status = true;
                    message = "Order Updated Successfully!";
                }
                catch (Exception ex)
                {
                    // Handle exception (logging, etc.)
                    message = $"Error: {ex.Message}";
                }
            }

            return status;
        }


        public ForgotPasswordResponse ForgotPassword(string emailId)
        {
            ForgotPasswordResponse response = new ForgotPasswordResponse();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("USP_ForgotPassword", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@EmailId", emailId);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            response.Status = reader["Status"].ToString();
                            if (response.Status == "Success")
                            {
                                response.PasswordToSend = reader["PasswordToSend"].ToString();
                                response.Message = "Password retrieved successfully";
                            }
                            else
                            {
                                response.Message = reader["Message"].ToString();
                            }
                        }
                    }
                }
            }

            return response;
        }


        public async Task<int> InsertOtpAsync(OtpEntry otpEntry)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("InsertOtp", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@EmailId", otpEntry.EmailId);
                    command.Parameters.AddWithValue("@Otp", otpEntry.Otp);
                    command.Parameters.AddWithValue("@ExpirationTime", otpEntry.ExpirationTime);

                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            // Get the result code (OTP Id or -1 if email does not exist)
                            int resultCode = reader.GetInt32(0);

                            return resultCode; // Return the result (either OTP Id or -1)
                        }
                    }
                }
            }

            return -1; // Return -1 if nothing was returned
        }




        public async Task<bool> VerifyOtpAsync(string emailId, string otp)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand("VerifyOtp", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@EmailId", emailId);
                    command.Parameters.AddWithValue("@Otp", otp);

                    await connection.OpenAsync();
                    var result = await command.ExecuteScalarAsync();

                    return (result != null && result is int && (int)result == 1);
                }
            }
        }

        //public async Task DeleteVerifiedOtpsAsync()
        //{
        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        using (var command = new SqlCommand("DeleteVerifiedOtps", connection))
        //        {
        //            command.CommandType = CommandType.StoredProcedure;

        //            await connection.OpenAsync();
        //            await command.ExecuteNonQueryAsync();
        //        }
        //    }
        //}
    }

}