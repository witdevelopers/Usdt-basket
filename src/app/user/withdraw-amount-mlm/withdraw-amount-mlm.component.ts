import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule, NgForm } from '@angular/forms';
import { WalletService } from '../services/wallet.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdraw-amount-mlm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw-amount-mlm.component.html',
  styleUrls: ['./withdraw-amount-mlm.component.css'],
})
export class WithdrawAmountMlmComponent implements OnInit {
  isVisible = false;
  withdrawalHistory: any[] = [];
  wallets: any[] = [];
  selectedWallet: number;
  mainWalletBal = 0;
  balanceDividend = 0;
  isSubmitted = false;
  responseMessage = '';

  withdrawalData = {
    address: '',
    amount: 0,
    remarks: '',
  };

  constructor(private userService: UserService, private wallet: WalletService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    if (!this.isVisible) this.withdrawalData.address = sessionStorage.getItem('address') || '';
    this.initialize();
  }

  ngOnInit(): void {}

  async initialize() {
    const info = ((await this.userService.userDashBoardDetails()) as any).data.table[0];
    this.balanceDividend = info.totalIncome - info.amountWithdrawn;

    const response = (await this.wallet.getWallets('Withdrawal')) as any;
    if (response?.status && response.data?.table) {
      this.wallets = response.data.table;
      this.selectedWallet = this.wallets.length > 1 ? this.wallets[1].srno : this.wallets[0].srno;
      console.log(this.wallets);

      this.onWalletChange();
    }
  }

  async onWalletChange() {
    const response = (await this.wallet.getBalanceMlm(this.selectedWallet, this.withdrawalData.address)) as any;
    this.mainWalletBal = response.balance;
  }

  onSubmit(form: NgForm) {
    if (!this.isVisible && !this.withdrawalData.address) {
      this.withdrawalData.address = sessionStorage.getItem('address') || '';
    }

    this.isSubmitted = true;

    if (this.withdrawalData.amount <= 0 || this.withdrawalData.amount > this.mainWalletBal) {
      return;
    }

    this.userService
      .placeWithdrawalOrderMlm(
        this.withdrawalData.address,
        this.selectedWallet,
        this.withdrawalData.amount,
        this.withdrawalData.remarks
      )
      .subscribe(
        (response) => {
          if (response.data?.table?.[0]?.success?.toLowerCase() === 'true') {
            Swal.fire('Success', 'Withdrawal successful!', 'success');
            this.onWalletChange();
            this.initialize();
            form.reset();
          } else {
            this.responseMessage = response.data?.table?.[0]?.message || 'Withdrawal failed';
          }
        },
        () => {
          this.responseMessage = 'Withdrawal request failed. Please try again.';
        }
      );
  }

  showWithdrawalHistory() {
    const sessionUid = sessionStorage.getItem('address');
    this.userService.getWithdrawalHistory(sessionUid).then((response) => {
      if (response.status) {
        this.withdrawalHistory = response.data.table;
      }
    });
  }

  clearData() {
    this.withdrawalData = { address: '', amount: 0, remarks: '' };
  }
}
