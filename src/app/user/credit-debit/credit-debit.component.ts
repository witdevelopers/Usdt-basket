import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-credit-debit',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './credit-debit.component.html',
  styleUrls: ['./credit-debit.component.css'],
})
export class CreditDebitComponent implements OnInit {
  userId: string = ''; // User ID input
  balance: number = 0; // Wallet balance
  transactionType: string = ''; // Transaction type (credit/debit)
  amount: number = 0; // Transaction amount
  remarks: string = ''; // Transaction remarks
  transactions: any[] = []; // Transaction history
  transactionsFetched: boolean = false; // Flag for transaction fetching
  loading: boolean = false; // Loading state for processing
  walletType: number= 0; // Wallet type
  byAdminId: number = 0; // Admin ID
  responseMessage: string = ''; // Response message
  filterUserId: string | null = null; // Filtered User ID for non-admin users
  isVisible: boolean = false; // Flag to control visibility of admin-only fields
  withdrawalHistory: any[] = []; // Withdrawal history
  wallets: any[] = []; // List of wallets
  mainWalletBal: number = 0; // Main wallet balance
  balanceDividend: number = 0; // Balance dividend
  isSubmitted: boolean = false; // Form submission flag
  paymentToken: string = Settings.paymentToken; // Payment token

  withdrawalData = {
    UserId: '',
    walletId: 0,
    amount: 0,
    remarks: '',
  };

  constructor(
    private userService: UserService,
    private wallet: WalletService
  ) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    this.filterUserId = this.isVisible ? null : sessionStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.walletType = parseInt(sessionStorage.getItem('walletType') || '1');
    this.byAdminId = parseInt(sessionStorage.getItem('byAdminId') || '1');
    this.initialize();
    if (!this.isVisible && this.filterUserId) {
      this.withdrawalData.UserId = this.filterUserId;
    }
  }

  async initialize(): Promise<void> {
    try {
      const info = ((await this.userService.userDashBoardDetails()) as any).data
        .table[0];
      this.balanceDividend = Number(info.totalIncome - info.amountWithdrawn);
      this.wallets = ((await this.wallet.getWallets('topup')) as any).table;
      this.walletType = this.wallets[0].srno;
      this.withdrawalData.walletId = this.wallets[0].srno;
      await this.onWalletChange();
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  async onWalletChange(): Promise<void> {
    try {
      const response = (await this.wallet.getBalanceMlm(
        this.walletType,
        this.userId
      )) as any;
      this.mainWalletBal = response.balance;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  }

  fetchBalance(): void {
    this.onWalletChange();
  }

  processTransaction(): void {
    if (!this.userId || !this.transactionType || this.amount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill all fields correctly.',
      });
      return;
    }

    this.loading = true;

    this.userService
      .creditDebitAmountWallet(
        this.userId,
        this.walletType,
        this.transactionType,
        this.amount,
        this.remarks,
        this.byAdminId
      )
      .subscribe(
        (response) => {
          this.loading = false;
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Transaction Successful',
              text: response.message,
            });
            this.clearForm();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Transaction Failed',
              text: response.message || 'Transaction could not be completed.',
            });
          }
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Transaction Failed',
            text:
              error.error?.message || error.message || 'An error occurred.',
          });
        }
      );
  }

  viewTransactions(): void {
    const userId = this.userId;
    const walletId = this.walletType;
    const searchQuery = sessionStorage.getItem('usertype') || 'admin';

    this.userService
      .passbookHistory(userId, walletId, null, null, searchQuery)
      .subscribe(
        (res: any) => {
          if (res.status && res.data?.table?.length > 0) {
            this.transactions = res.data.table;
            this.responseMessage = '';
          } else {
            this.transactions = [];
            this.responseMessage = res.message || 'No transactions found!';
          }
          this.transactionsFetched = true;
        },
        (error) => {
          console.error('Error fetching transactions:', error);
          this.responseMessage = 'Error fetching transactions!';
          this.transactionsFetched = true;
        }
      );
  }

  clearForm(): void {
    this.userId = '';
    this.amount = 0;
    this.remarks = '';
    this.transactionType = ''; // Reset transaction type
  }

  onSubmit(form: NgForm): void {
    if (!this.isVisible && !this.withdrawalData.UserId) {
      this.withdrawalData.UserId = this.userId;
    }

    this.isSubmitted = true;

    if (
      this.withdrawalData.amount <= 0 ||
      this.withdrawalData.amount > this.mainWalletBal
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Ensure the amount is valid and within your balance.',
      });
      return;
    }

    this.userService
      .placeWithdrawalOrderMlm(
        this.withdrawalData.UserId,
        this.withdrawalData.walletId,
        this.withdrawalData.amount,
        this.withdrawalData.remarks
      )
      .subscribe(
        (response) => {
          if (response.status) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: response.message,
            });
            this.onWalletChange();
            form.reset();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message,
            });
          }
        },
        (error) => {
          console.error('Error placing withdrawal order:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'An error occurred while processing your request.',
          });
        }
      );
  }

  showWithdrawalHistory(): void {
    const sessionUid = sessionStorage.getItem('userId');
    this.userService
      .getWithdrawalHistory(sessionUid)
      .then((response) => {
        if (response.status) {
          this.withdrawalHistory = response.data.table;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Check Again',
            text: response.message,
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching withdrawal history:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Could not fetch withdrawal history.',
        });
      });
  }

  errorMessage: string = '';
  successMessage: string = '';
  
  onWalletTypeChange(): void {
    if (!this.userId) {
      return;
    }
  
    this.withdrawalData.walletId = this.walletType;
    this.fetchBalance();
  
    this.userService.getUserDetails(this.userId).subscribe(
      (response: any) => {
        if (response.data && response.data.length > 0) {
          const userDetails = response.data[0];
  
          if (userDetails.valid === "True") {
            this.successMessage = `User ID is valid.`;
            this.errorMessage = '';
          } else {
            this.errorMessage = userDetails.message;
            this.successMessage = '';
          }
        }
      },
      (error) => {
        console.error('API call error:', error);
        this.errorMessage = 'Unable to fetch user details. Please try again later.';
        this.successMessage = '';
      }
    );
  }
  
  
  
}
