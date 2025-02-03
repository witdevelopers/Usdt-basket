import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Settings } from 'src/app/app-setting';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common'; // Import the Settings class
import { WalletService } from 'src/app/user/services/wallet.service';

@Component({
  selector: 'app-checkout-confirm',
  templateUrl: './checkout-confirm.component.html',
  styleUrls: ['./checkout-confirm.component.css'],
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
})
export class CheckoutConfirmComponent implements OnInit {
  cartDetails: any = null;
  totalCartPrice = 0;
  totalDiscountPrice = 0;
  totalQuantity = 0;
  isCartEmpty = true;
  userWallets: any[] = [];
  walletBalance: number = 0; // Wallet balance
  selectedPaymentMethod: string = ''; // Selected payment method
  memberId: number = 0; // User's memberId for API
  selectedAddressId: number | null = null;
  selectedWallet: number = 1;
  private imageBaseUrl: string = Settings.imageBaseUrl; // Dynamic base URL for images from Settings
  withdrawalData: any;
  mainWalletBal: number = 0;
  wallets: any[] = [];
  balanceDividend: number = 0;

  constructor(
    private userService: UserService,
    private router: Router,
    private wallet: WalletService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.retrieveAddressId();
    const memberId = sessionStorage.getItem('memberId'); // Retrieve memberId from sessionStorage
    if (memberId) {
      this.memberId = +memberId;

      this.getCartDetails(); // Fetch cart details
    } else {
      Swal.fire('Error', 'No member ID found. Please log in again.');
    }
    this.initialize();
  }

  async initialize() {
    let info = ((await this.userService.userDashBoardDetails()) as any).data
      .table[0];
    this.balanceDividend = Number(info.totalIncome - info.amountWithdrawn);
    //console.log(this.balanceDividend);
 try {
      const response = (await this.wallet.getWallets('topup')) as any;
      if (response.status && response.data && response.data.table) {
        this.wallets = response.data.table;
        this.selectedWallet = this.wallets.length > 1 ? this.wallets[1].srno : null;
        this.onWalletChange();
      }
    } catch (error) {
      // Do not include console statements for logging errors
    }
    this.onWalletChange();
    this.cdr.detectChanges();
    console.log('Wallet name: ', this.userWallets);
  }

  private retrieveAddressId(): void {
    this.selectedAddressId = this.userService.getSelectedAddressId();
    if (!this.selectedAddressId) {
      Swal.fire('Error', 'No selected address ID found.');
    }
  }

  async onWalletChange() {
    const userId = sessionStorage.getItem('userId');
    const response = (await this.wallet.getBalanceMlm(
      this.selectedWallet,
      userId,
    )) as any;
    this.mainWalletBal = response.balance;
  }

  getCartDetails(): void {
    if (this.memberId) {
      this.userService.getCart(this.memberId).subscribe(
        (data) => {
          this.cartDetails = data;
          this.isCartEmpty = !this.cartDetails?.items?.length;

          if (!this.isCartEmpty) {
            // Fix image URLs and calculate prices/quantities
            this.cartDetails.items = this.cartDetails.items.map((item: any) => {
              if (item.imageUrl?.startsWith('~/')) {
                item.imageUrl = this.getImageUrl(item.imageUrl); // Dynamically construct image URL
              }
              return item;
            });

            // Calculate total prices and quantities
            this.totalCartPrice = this.cartDetails.items.reduce(
              (sum: number, item: any) => sum + item.price * item.quantity,
              0,
            );
            this.totalDiscountPrice = this.cartDetails.items.reduce(
              (sum: number, item: any) =>
                sum + item.discountPrice * item.quantity,
              0,
            );
            this.totalQuantity = this.cartDetails.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0,
            );
          }
        },
        (error) => {
          Swal.fire(
            'Error',
            'There was an error fetching cart details. Please try again later.',
          );
        },
      );
    } else {
      Swal.fire('Error', 'Please log in and try again.');
    }
  }

  // Method to construct the full image URL
  private getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}` // Construct full image URL using dynamic base URL
      : 'assets/default-image.jpg'; // Fallback image URL
  }

  onPaymentMethodSelect(method: string): void {
    this.selectedPaymentMethod = method;
  }

  confirmCheckout(): void {
    if (!this.selectedPaymentMethod) {
      Swal.fire('Error', 'Please select a payment method');
      return;
    }

    switch (this.selectedPaymentMethod) {
      case 'wallet':
        this.handleWalletPayment(); // Wallet Payment with ID 1
        break;
      case 'credit-card':
        this.handleCardPayment(); // Credit Card Payment with ID 2
        break;
      case 'cod':
        this.placeOrder(1); // COD with ID 3
        break;
      default:
        Swal.fire('Error', 'Invalid payment method selected');
    }
  }

  handleWalletPayment(): void {
    if (this.mainWalletBal >= this.totalDiscountPrice) {
      this.placeOrder(2);
    } else {
      Swal.fire('Insufficient Balance', 'Your wallet balance is insufficient');
    }
  }

  handleCardPayment(): void {
    Swal.fire({
      title: 'Enter Card Details',
      html: `
        <input type="text" id="cardNumber" class="swal2-input" placeholder="Card Number">
        <input type="text" id="expiryDate" class="swal2-input" placeholder="Expiry Date (MM/YY)">
        <input type="text" id="cvv" class="swal2-input" placeholder="CVV">
      `,
      showCancelButton: true,
      confirmButtonText: 'Proceed with Card',
      preConfirm: () => {
        const cardNumber = (
          document.getElementById('cardNumber') as HTMLInputElement
        ).value;
        const expiryDate = (
          document.getElementById('expiryDate') as HTMLInputElement
        ).value;
        const cvv = (document.getElementById('cvv') as HTMLInputElement).value;

        if (!cardNumber || !expiryDate || !cvv) {
          Swal.showValidationMessage('Please enter all card details');
          return null;
        }

        return { cardNumber, expiryDate, cvv };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.placeOrder(3); // Credit Card Payment Method ID is 2
      }
    });
  }

  placeOrder(paymentMethod: number): void {
    if (this.isCartEmpty) {
      Swal.fire(
        'Error',
        'Your cart is empty. Please add items to your cart before proceeding.',
      );
      return;
    }

    if (!this.memberId) {
      Swal.fire('Error', 'Member ID is missing. Please log in and try again.');
      return;
    }

    const orderPayload = {
      customerId: this.memberId,
      addressId: this.selectedAddressId,
      remarks: 'order',
      orderPayments: [
        {
          orderNo: this.generateOrderId(),
          transactionId: new Date().getTime().toString(),
          paymentMethodId: paymentMethod, // Payment method ID passed dynamically
          amountPaid: this.totalDiscountPrice,
          onDate: new Date().toISOString(),
        },
      ],
    };

    this.userService.createOrder(orderPayload).subscribe(
      (response: any) => {
        console.log('Create order response:', response);

        // Extract orderId from the response
        const orderId = response?.response?.orderId;
        console.log('Order ID from response', orderId);

        if (orderId) {
          // Store the orderId in sessionStorage
          sessionStorage.setItem('orderId', orderId);

          // Show a success message and navigate to the invoice page
          Swal.fire(
            'Order Placed',
            'Your order has been placed successfully',
            'success',
          );
          this.router.navigate(['/usershop/order-invoice']);
        } else {
          Swal.fire('Error', 'Order ID not found in the response', 'error');
        }
      },
      (error) => {
        Swal.fire('We Found Some issue', 'Please try again.');
      },
    );
  }

  generateOrderId(): string {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generates a 10-digit random number
  }
}
