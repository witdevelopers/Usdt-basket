import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FundService } from '../services/fund.service';
import { UserService } from '../services/user.service';
import { WalletService } from '../services/wallet.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { IncomeWithdrawalHistoryComponent } from '../income-withdrawal-history/income-withdrawal-history.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-withdraw-dividend',
  templateUrl: './withdraw-dividend.component.html',
  styleUrls: ['./withdraw-dividend.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ValidationMessageComponent,
    MatInputModule,
    MatButtonModule,
    IncomeWithdrawalHistoryComponent,
    DecimalPipe,
    CommonModule
  ],
})
export class WithdrawDividendComponent implements OnInit {

  withdrawalAmount: number = 1;
  balanceDividend: number = 10;
  amountReceived: number;
  // deductionPercentage: number = 10;
  selectedWallet: any;
  address: any;
  wallets: any[] = [];
  mainWalletBal: any;
  paymentToken: string = Settings.paymentToken;
  info: any;

  constructor(private spinnerService: NgxSpinnerService, private wallet: WalletService, private fund: FundService, private userInfoService: UserService) {
  }

  ngOnInit() {
    this.address = sessionStorage.getItem('address');
    this.initialize();
  }

  async initialize() {
    this.info = ((await this.userInfoService.userDashBoardDetails()) as any).data.table1[0];
    //this.balanceDividend = Number(this.info.totalIncome - this.info.amountWithdrawn);
    this.wallets = (await this.wallet.getWallets('Withdrawal'))?.data?.table;
    this.selectedWallet = this.wallets.length ? this.wallets[0].srno : '';
    this.onWalletChange();
  }

  async onWalletChange() {
    let response = (await this.wallet.getBalanceMlm(this.selectedWallet, this.address)) as any;
    this.mainWalletBal = response.balance;
  }

  max() {
    this.withdrawalAmount = this.mainWalletBal;
    this.calculateAmountReceived();
  }

  async withdraw() {
    this.spinnerService.show();
    debugger
    let result: any = await this.fund.withdrawIncome(this.withdrawalAmount, this.selectedWallet);

    this.spinnerService.hide();
    if (result.status) {
      Swal.fire({
        icon: "success",
        title: result.message
      }).then(async () => {
        this.initialize()
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: result.message
      });
    }
  }

  async calculateAmountReceived() {
    this.amountReceived = this.withdrawalAmount - (this.withdrawalAmount * this.info.withdrawalPercentage / 100)
  }
}
