import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Settings } from 'src/app/app-setting'; // Adjust the import path as needed
import { EncryptionService } from '../encryption.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  standalone: true,
  imports: [NgStyle, CommonModule, FormsModule],
})
export class ProductDetailsComponent implements OnInit {
  singleProduct: any;
  singleProductDetails: any[] = [];
  singleProductImages: any[] = [];
  relatedProducts: any[] = []; // For storing related products
  productId: number;
  mainImageUrl: string = 'assets/default-image.jpg'; // Default image URL
  quantity: number = 1; // Default quantity
  isProductInCartFlag: boolean = false;
  cartQuantity: number = 0; // Variable to track cart quantity
  singleProductSize: any[] = []; // Array to store size
  selectedSize: number; // Property to store selected size

  // Zoom-related variables
  isZooming: boolean = false;
  backgroundPosition: string = '0% 0%';
  backgroundSize: string = '250%'; // Zoom level (adjust as needed)
  isLoggedIn: boolean;
  userName: string;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient,
    private router: Router, // Add Router for redirection
    private encryptionService: EncryptionService,
  ) {
    this.route.params.subscribe((params) => {
      const encryptedId = params['id'];
      this.productId = +this.encryptionService.decrypt(encryptedId); // Decrypt and parse the ID
      this.productId = +this.route.snapshot.params['id'];
    });
    this.loadProductDetails(this.productId);
  }

  ngOnInit(): void {
    this.checkIfProductInCart();
  }

  // Subscribe to the cart quantity observable to track cart updates
  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');

    if (sessionUserId) {
      // If userId is found in sessionStorage, consider the user logged in
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });

      // Initial cart quantity load from sessionStorage userId
      this.userService.updateCartQuantity(Number(sessionUserId));
    } else if (tempUserId) {
      // If userId is found only in localStorage (guest/anonymous user), set isLoggedIn to false
      this.isLoggedIn = false;

      // Subscribe to cart quantity observable for anonymous user
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });

      // Initial cart quantity load from localStorage (anonymous userId)
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }

  onMouseMove(event: MouseEvent): void {
    const container = event.target as HTMLElement;
    const containerRect = container.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    // Calculate background position for zoomed image
    const xPercent = (x / containerRect.width) * 100;
    const yPercent = (y / containerRect.height) * 100;

    this.backgroundPosition = `${xPercent}% ${yPercent}%`;
    this.isZooming = true; // Show the zoomed image when the mouse is inside
  }

  // Hide zoom result when the mouse leaves the image
  onMouseLeave(): void {
    this.isZooming = false;
  }

  checkIfProductInCart(): void {
    let customerId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');

    if (customerId) {
      this.userService.getCart(+customerId).subscribe(
        (response: any) => {
          this.isProductInCartFlag = response.items.some(
            (item) => item.productId === this.productId,
          );
        },
        (error) => {
          this.isProductInCartFlag = false; // Default to "not in cart" if there's an error
        },
      );
    }
  }

  // Load product details by product ID
  loadProductDetails(id: number): void {
    this.userService.getProductById(id).subscribe(
      (response: any) => {
        this.singleProduct = response.singleProduct;
        this.singleProductDetails = response.singleProductDetails;
        this.singleProductImages = response.singleProductImages;
        this.singleProductSize = response.singleProductSize; // Assign sizes from API response

        const mainImage = this.singleProductImages.find(
          (image) => image.isMainImage,
        );

        if (mainImage) {
          this.mainImageUrl = this.getImageUrl(mainImage.imageUrl);
        } else {
          if (this.singleProductImages.length > 0) {
            this.mainImageUrl = this.getImageUrl(
              this.singleProductImages[0].imageUrl,
            );
          } else {
            this.mainImageUrl = 'assets/default-image.jpg';
          }
        }

        this.loadRelatedProducts(this.singleProduct.categoryId);
      },
      (error) => {
        // Handle error
      },
    );
  }
  // Load related products based on category ID, excluding the current product
  loadRelatedProducts(categoryId: number): void {
    this.userService
      .getAllProductByCategoryId(categoryId)
      .subscribe((response: any) => {
        if (response && response.table) {
          this.relatedProducts = response.table.filter(
            (product: any) => product.productId !== this.productId,
          ); // Exclude current product
        } else {
          this.relatedProducts = [];
        }
      });
  }

  // Convert image path to a usable URL
  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'assets/default-image.jpg'; // Fallback to default image if no image path is provided
    }

    if (imagePath.includes('~/')) {
      imagePath = imagePath.replace('~/', Settings.imageBaseUrl);
    }

    return !imagePath.startsWith('http')
      ? `${Settings.imageBaseUrl}${imagePath}`
      : imagePath;
  }

  // Change main image when selecting a different one
  changeMainImage(imageUrl: string): void {
    this.mainImageUrl = this.getImageUrl(imageUrl); // Update the main image
  }

  addToCart(): void {
    let customerId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');
    const productDtId = this.productId;
    const quantity = this.quantity;
    const selectedSize = this.selectedSize;
    console.log('Selected size', selectedSize);

    // Ensure you have the selected sizeId
    if (this.selectedSize) {
      if (customerId) {
        this.userService
          .addToCart(+customerId, productDtId, quantity, selectedSize)
          .subscribe(
            () => {
              this.ngOnInit(); // Re-run the component initialization to update the cart status
              // Update the cart quantity after adding to cart
              this.updateCartQuantity();
            },
            () => {
              // Handle error here if needed
            },
          );
      }
    } else {
      alert('Please select a size.');
    }
  }

  // Go to the cart page
  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
    this.updateCartQuantity();
  }

  // Buy now functionality
  buyNow(): void {
    this.router.navigate(['/shopping-cart']);
    this.updateCartQuantity();
  }

  // View related product's details
  viewProduct(productId: number): void {
    this.updateCartQuantity();
    this.router.navigate(['/product', productId]).then(() => {
      this.router
        .navigateByUrl('/product', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['/product', productId]);
        });
    });
  }

  calculateDiscountPercentage(price: number, discountPrice: number): number {
    if (price && discountPrice && price > discountPrice) {
      return Math.round(((price - discountPrice) / price) * 100);
    }
    return 0; // Return 0 if there's no discount
  }
}
