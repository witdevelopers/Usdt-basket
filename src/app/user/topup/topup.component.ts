import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { WalletService } from '../services/wallet.service';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-topup',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule],
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.css'],
})
export class TopupComponent implements OnInit {
  userId: string = '';
  userName: string = '';
  availableBalance: number = 0;
  fullName: string = '';
  emailId: string = '';
  mobileNo: string = '';
  mainWalletBal: number = 0;
  packages: any[] = [];
  packageValue: number = 0;
  selectedPackage: any = -1;
  amount: number;
  userIdForTopup: any;
  sessionuserId: any;
  isSubmitted: any;
  isVisible: boolean = false;
  selectedWallet: number;
  withdrawalAmount: number = 0.1;
  balanceDividend: number = 0;
  amountReceived: number = 0;
  deductionPercentage: number = 10;
  wallets: any[] = [];
  isAmountValid: boolean = true;
  paymentToken: string = Settings.paymentToken;
  userType: string | null = '';
  adminId: number | null = null;
  memberId: number | null = null;
  walletidd: any ;

  constructor(
    private userService: UserService,
    private wallet: WalletService
  ) {
    this.userType = sessionStorage.getItem('usertype');
    this.isVisible = this.userType === 'User';
    this.userIdForTopup = this.userType === 'User' ?  sessionStorage.getItem('userId') : null;
    this.sessionuserId = this.userType === 'User' ?  sessionStorage.getItem('userId') : null;
    this.walletidd = this.userType === 'User' ?  sessionStorage.getItem('userId') : 0;

    if (this.userType === 'User') {
      this.onUserIdChange();
    }
  }

  ngOnInit(): void {
    this.getPackages();
    this.initialize();
    
  }
  async initialize() {
    const info = ((await this.userService.userDashBoardDetails()) as any).data.table[0];
    this.balanceDividend = Number(info.totalIncome - info.amountWithdrawn);
  
    try {
      const response = (await this.wallet.getWallets('topup')) as any;
      if (response.status && response.data && response.data.table) {
        this.wallets = response.data.table;
        this.selectedWallet = this.wallets.length > 1 ? this.wallets[1].srno : this.wallets[0].srno;
        this.onWalletChange();
      }
    } catch (error) {}
  
    this.onWalletChange();
  }
  
  validateAmount() {
    this.isAmountValid = this.amount >= 100 && this.amount <= 100000;
  }

  async onWalletChange() {
    const response = (await this.wallet.getBalanceMlm(this.selectedWallet, this.sessionuserId)) as any;
    this.mainWalletBal = response.balance;
    
  }

  clearData() {
    this.userIdForTopup = '';
    this.selectedPackage = 0;
    this.userName = '';
    this.fullName = '';
  }

  getPackages() {
    this.userService.getPackages().subscribe(
      (response) => {
        if (response.status === true) {
          this.packages = response.data;
        }
      },
      (error) => {
        console.error('Error fetching packages:', error);
      }
    );
  }

  onPackageChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPackageId = Number(selectElement.value);
    this.selectedPackage = this.packages.find((pkg) => pkg.srno === selectedPackageId);

    this.amount = this.selectedPackage ? this.selectedPackage.value : null;
  }

  onUserIdChange() {
    this.userService.getUserDetailsTop(this.userIdForTopup).subscribe((response) => {
      if (
        response.status &&
        response.data &&
        response.data.length > 0 &&
        response.data[0].valid === 'True'
      ) {
        const user = response.data[0];
        this.fullName = user.fullName;
      } else {
        Swal.fire({
          icon: 'error',
          title: response.data[0].message,
        });
        this.clearData();

        
      }
    });
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true;

    this.adminId = Number(sessionStorage.getItem('adminId'));
    this.memberId = Number(sessionStorage.getItem('memberId'));

    const userId = form.value.userIdForTopup;
    const packId = form.value.package;
    const pinValue = this.amount;
    const isByAdmin = this.userType === 'Admin';
    const paymentMode = isByAdmin ? 'Admin' : 'wallet';
    const walletId = isByAdmin ? 0 : this.selectedWallet;
    const ByMemberIdOrAdminID = isByAdmin ? this.adminId : this.memberId;

    if (!userId || !packId) {
      
      return;
    }

    if (this.userType === 'User' && !this.selectedWallet) {
      
      return;
    }

    this.userService
      .topUp(userId, packId, pinValue, ByMemberIdOrAdminID, isByAdmin, paymentMode, walletId)
      .subscribe(
        (response) => {
          if (response.data && response.data.table && response.data.table.length > 0) {
            const tableResponse = response.data.table[0];

            if (tableResponse.success === 'False') {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: tableResponse.message,
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: tableResponse.message,
                confirmButtonText: 'OK',
              });
              this.clearData();


              if (this.userType === 'User') {
                this.onWalletChange();  // Call API only if isVisible is true
              }
              
            }
          }
        },
        (error) => {
          console.error('Error during topup', error);
        }
      );
      
  }
}
