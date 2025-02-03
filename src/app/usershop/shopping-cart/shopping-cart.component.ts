import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Router, RouterLink } from '@angular/router';
import { Settings } from 'src/app/app-setting';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SlicePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: true,
  imports: [RouterLink, SlicePipe, CurrencyPipe],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  summary: any = {};
  customerId: number | null = null;
  imageBaseUrl: string = Settings.imageBaseUrl;
  userName: string;
  cartQuantity: number;
  isLoggedIn: boolean;
  private unsubscribe$ = new Subject<void>();
  sizeId: number;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customerId =
      Number(sessionStorage.getItem('memberId')) ||
      Number(localStorage.getItem('TempUserId'));
    if (this.customerId) {
      this.loadCart();
      this.updateCartQuantity();
    } else {
      this.router.navigate(['/signin']);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  updateCartQuantity(): void {
    const userId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');
    this.isLoggedIn = !!sessionStorage.getItem('memberId');

    this.userService.cartQuantity$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });

    if (userId) {
      this.userService.updateCartQuantity(Number(userId));
    }
  }

  loadCart(): void {
    this.userService.getCart(this.customerId!).subscribe(
      (data) => {
        this.cartItems =
          data.items?.map((item: any) => ({
            ...item,
            imageUrl: this.getImageUrl(item.imageUrl),
          })) || [];

        this.summary = {
          subTotal: data.summary.bvTotal || 0,
          total: data.summary.priceTotal || 0,
        };
      },
      (error) => {
        console.error(error); // Log error for debugging
      },
    );
  }

  getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}`
      : 'assets/default-image.jpg';
  }

  updateCartItem(productDtId: number, quantity: number): void {
    if (quantity < 1) {
      return;
    }

    const cartData = {
      customerId: this.customerId,
      productDtId,
      quantity,
    };

    this.userService.updateCart(cartData).subscribe(
      () => {
        this.loadCart();
        this.updateCartQuantity();
      },
      (error) => {
        console.error(error); // Log error for debugging
      },
    );
  }

  removeCartItem(productDtId: number, sizeId: number): void {
    this.userService
      .removeCartItem(this.customerId!, productDtId, false)
      .subscribe(
        () => {
          this.loadCart();
          this.updateCartQuantity();
        },
        (error) => {
          console.error(error); // Log error for debugging
        },
      );
  }

  incrementQuantity(item: any): void {
    if (item.quantity < 9) {
      // Assuming the max quantity is 9
      item.quantity++;
      this.updateCartItem(item.productDtId, item.quantity);
    }
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      // Assuming the minimum quantity is 1
      item.quantity--;
      this.updateCartItem(item.productDtId, item.quantity);
    } else {
      this.removeCartItem(item.productDtId, this.sizeId); // Remove item if quantity reaches 0
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Method to navigate to product details page
  goToProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]); // Adjust the route as needed
  }
}
