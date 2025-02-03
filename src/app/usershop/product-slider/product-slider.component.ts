import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Settings } from 'src/app/app-setting'; // Import the Settings class
import { Router, RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common'; // Import Router for navigation

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css'],
  standalone: true,
  imports: [RouterLink, SlicePipe],
})
export class ProductSliderComponent implements OnInit, OnDestroy {
  homePageSectionProducts: any = {};
  private ngUnsubscribe = new Subject<void>();
  addedProducts: Set<number> = new Set(); // Track added products
  userName: string;
  cartQuantity: number;
  isLoggedIn: boolean;
  sizeId: number;
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadHomeSectionProductsDetails();
    this.loadCartState();
  }

  private loadHomeSectionProductsDetails(): void {
    this.userService
      .getHomePageSectionProduct()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.homePageSectionProducts = this.groupProductsBySection(data);
        },
        error: (err) => {
          // Optionally handle the error without logging it
        },
      });
  }

  private groupProductsBySection(data: any[]): any {
    return data.reduce((sections, product) => {
      const section = product.sectionName || 'Others';

      // Initialize the section if not present
      if (!sections[section]) sections[section] = [];

      // Process the imageUrl by replacing tilde and handling relative paths
      const processedImageUrl = product.imageUrl
        ? product.imageUrl.includes('~/')
          ? product.imageUrl.replace('~/', Settings.imageBaseUrl) // Replace tilde with base URL
          : product.imageUrl.startsWith('http')
            ? product.imageUrl
            : `${Settings.imageBaseUrl}${product.imageUrl}` // Prepend base URL for relative paths
        : 'assets/default-image.jpg'; // Fallback to default image if imageUrl is missing

      // Add the product to the section with the processed imageUrl
      sections[section].push({
        ...product,
        imageUrl: processedImageUrl,
      });

      return sections;
    }, {});
  }

  private loadCartState(): void {
    const customerId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');
    if (customerId) {
      this.userService.getCart(+customerId).subscribe({
        next: (response: any) => {
          // Check if response has 'items' property and it's an array
          if (response && Array.isArray(response.items)) {
            response.items.forEach((item) =>
              this.addedProducts.add(item.productId),
            );
          } else {
          }
        },
        error: (error) => {},
      });
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(cart)) {
        cart.forEach((item: any) => this.addedProducts.add(item.productId));
      } else {
      }
    }
  }

  updateCartQuantity() {
    const userId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');
    if (userId) {
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      // Subscribe to cart quantity observable
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });

      // Initial cart quantity load
      this.userService.updateCartQuantity(Number(userId));
    }
  }

  addToCart(productId: number, buttonElement: HTMLElement): void {
    const customerId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');

    if (!customerId) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = cart.findIndex(
        (item: any) => item.productId === productId,
      );

      if (existingProductIndex === -1) {
        cart.push({ productId, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartQuantity();
        this.addedProducts.add(productId); // Mark product as added
        buttonElement.classList.add('clicked');
        // this.userService.updateCartQuantity(Number(customerId));
      } else {
        this.goToCart(); // Navigate to cart if already in cart
      }
      return;
    }

    this.userService
      .addToCart(+customerId, productId, 1, this.sizeId)
      .subscribe({
        next: () => {
          this.updateCartQuantity();
          this.addedProducts.add(productId); // Mark product as added
          buttonElement.classList.add('clicked');
        },
        error: (error) => {},
      });
  }

  isProductAdded(productId: number): boolean {
    return this.addedProducts.has(productId);
  }

  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  objectKeys = Object.keys;

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
