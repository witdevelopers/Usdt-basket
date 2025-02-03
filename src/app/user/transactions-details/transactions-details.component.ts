import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Settings } from 'src/app/app-setting';

interface PassbookHistoryResponse {
  data: {
    table: any[];
  };
}

@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TransactionsDetailsComponent implements OnInit {
  MiningIncome: any = [];
  filterUserId: string | null = '';
  PageNo: number = 1;
  PageSize: number = 100;
  totalItems: number = 0;
  transaction: any;
  isVisible: boolean;
  startDate: string | '' = '';
  endDate: string | '' = '';
  filteredDirects: any;
  directs: any;
  walletFilter: number;
  wallets: any[] = [];
  searchQuery: string = '';
  responseMessage: string = '';
  invalidUserMessage: string = '';
  invalidUserId: boolean = false;
  userName: string = '';
  paymentToken: string = Settings.paymentToken;

  constructor(private api: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';

    if (this.isVisible) {
      this.filterUserId = ''; // Admin will enter the user ID manually
    } else {
      this.filterUserId = sessionStorage.getItem('userId');
    }

    this.getWallets(); // Fetch wallets initially
  }

  ngOnInit(): void {
    if (!this.isVisible && this.filterUserId) {
      this.getUserDetails(this.filterUserId);
    }
  }

  getUserDetails(userId: string) {
    this.api.getUserDetails(userId).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          const user = response.data[0];
          if (user.valid === 'False') {
            this.invalidUserMessage = 'Invalid User ID';
            this.invalidUserId = true;
            this.userName = '';
          } else {
            this.invalidUserMessage = '';
            this.invalidUserId = false;
            this.userName = user.fullName || 'User not found';
          }
        } else {
          this.invalidUserMessage = 'User not found';
          this.invalidUserId = true;
          this.userName = '';
        }
      },
      (error) => {
        this.invalidUserMessage = 'Error fetching user details';
        this.invalidUserId = true;
        this.responseMessage = '';
        this.userName = '';
      }
    );
  }

  onUserIdChange() {
    if (this.filterUserId) {
      this.getUserDetails(this.filterUserId);
    } else {
      this.userName = '';
      this.invalidUserMessage = '';
      this.invalidUserId = false;
    }
  }

  getWallets() {
    this.api.getWallet().subscribe(
      (response: any) => {
        if (response && response.status && response.data && response.data.table) {
          this.wallets = response.data.table.map(wallet => ({
            id: wallet.srno,
            walletName: wallet.walletName
          }));
  
          console.log('Fetched wallets:', this.wallets);
  
          // Automatically select the first wallet if available
          if (this.wallets.length > 0) {
            this.walletFilter = this.wallets[0].id;
          }
        } else {
          this.responseMessage = 'No wallets found';
        }
      },
      (error) => {
        this.responseMessage = 'Error fetching wallets';
        console.error('Failed to fetch wallets:', error);
      }
    );
  }
  
  

  onFilterChange() {
    console.log('Selected Wallet Filter:', this.walletFilter);
  }

  filterWalletData() {
    if (this.walletFilter) {
      return this.wallets.filter(wallet => wallet.id === this.walletFilter);
    }
    return this.wallets;
  }

  viewTransactions(): void {
    const userId = this.filterUserId;
    const walletId = this.walletFilter;
    const fromDate = this.startDate;
    const toDate = this.endDate;
    const searchQuery = this.searchQuery || '';

    if (this.invalidUserId) {
      this.responseMessage = 'Please enter a valid User ID.';
      return;
    }

    if (!walletId) {
      this.responseMessage = 'Please select a wallet';
      return;
    }

    this.api.passbookHistory(userId, walletId, fromDate, toDate, searchQuery)
      .subscribe(
        (res: any) => {
          if (res.status && res.data && res.data.table && res.data.table.length > 0) {
            this.MiningIncome = res.data.table;
            this.totalItems = this.MiningIncome.length;
            this.responseMessage = '';
          } else {
            this.MiningIncome = [];
            this.responseMessage = res.message || 'No transactions found!';
          }
        },
        (error) => {
          this.MiningIncome = [];
          this.responseMessage = 'Error fetching transactions!';
        }
      );
  }

  get paginatedData() {
    const startIndex = (this.PageNo - 1) * this.PageSize;
    return this.MiningIncome.slice(startIndex, startIndex + this.PageSize) || [];
  }

  nextPage() {
    if (this.PageNo < this.totalPages) {
      this.PageNo++;
    }
  }

  prevPage() {
    if (this.PageNo > 1) {
      this.PageNo--;
    }
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.PageSize);
  }

  isFormValid() {
    return this.startDate && this.endDate && this.walletFilter && !this.invalidUserId;
  }
}
