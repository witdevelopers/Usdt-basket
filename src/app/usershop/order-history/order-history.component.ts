import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Settings } from 'src/app/app-setting';
import { CommonModule } from '@angular/common';

interface Order {
  isDelivered: boolean;
  singleProductOrderStatus: any;
  singleProductOrderPrice: any;
  status: null;
  id: number;
  orderNo: string;
  orderDate: string;
  orderStatus: string;
  orderAmount: number;
  imageUrl: string;
  productDtId: number; // Add productDtId to the Order interface
  // Add other properties as needed
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule],
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: Order[] = [];
  errorMessage: string | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const customerId = sessionStorage.getItem('memberId');

    if (customerId) {
      this.loadOrderHistory(customerId);
    } else {
      this.errorMessage = 'Please login to see your orders.';
    }
  }

  private loadOrderHistory(customerId: string): void {
    this.userService.getOrderDetails(customerId).subscribe(
      (data: Order[]) => {
        this.orderHistory = data.map((order) => ({
          ...order,
          imageUrl: this.processImageUrl(order.imageUrl),
        }));
        console.log('Order history data', this.orderHistory);
      },
      () => {
        this.errorMessage =
          'Failed to load order history. Please try again later.';
      },
    );
  }

  private processImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'assets/default-image.jpg';
    }
    if (imageUrl.includes('~/')) {
      return imageUrl.replace('~/', Settings.imageBaseUrl);
    }
    return imageUrl.startsWith('http')
      ? imageUrl
      : `${Settings.imageBaseUrl}${imageUrl}`;
  }

  showOrderDetails(id: number): void {
    console.log('Navigating to order details for orderNo:', id);
    this.router.navigate(['/usershop/order-details', id]);
  }

  cancelOrder(id: number, productDtId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.performCancellation(id, productDtId);
      }
    });
  }

  private performCancellation(orderId: number, productDtId: number): void {
    const orderStatus = 8; // Canceled order status
    const modifiedBy = +sessionStorage.getItem('memberId');

    this.userService
      .updateOrderStatus(orderId, productDtId, orderStatus, modifiedBy)
      .subscribe(
        (response) => {
          console.log('API Response:', response);

          if (response.status === true) {
            this.orderHistory = this.orderHistory.filter(
              (order) => order.id !== orderId,
            );
            Swal.fire('Canceled!', 'Your order has been canceled.', 'success');
            const customerId = sessionStorage.getItem('memberId');
            this.loadOrderHistory(customerId);
          } else {
            Swal.fire(
              'Failed',
              'Failed to cancel the order. Please try again.',
              'error',
            );
          }
        },
        () => {
          Swal.fire('Failed', 'Please try again later.', 'error');
        },
      );
  }
}
