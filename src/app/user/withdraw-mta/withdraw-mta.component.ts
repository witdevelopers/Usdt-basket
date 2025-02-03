import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Settings } from 'src/app/app-setting';
import { CompanyService } from 'src/app/services/company.service';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import { FundService } from '../services/fund.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-withdraw-mta',
  templateUrl: './withdraw-mta.component.html',
  styleUrls: ['./withdraw-mta.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationMessageComponent,
    MatButtonModule,
    DecimalPipe,
  ],
})
export class WithdrawMtaComponent implements OnInit {
  sellAmount: number = 0;
  maticAmount: number = 0;
  tokenSymbol: string = '';
  account: any;
  tokenRate: any;

  deductionPercentage: number = 5;
  TokenBalance: number = 0;
  maticAmount_WithoutDeduction: number = 0;

  _startId: number = 0;
  constructor(
    private spinnerService: NgxSpinnerService,
    private fund: FundService,
    private userInfoService: UserService,
    private company: CompanyService,
    private contractService: ContractService,
  ) {
    this.tokenSymbol = 'MTA';
    this.initialize();
  }

  ngOnInit(): void {}

  async initialize() {
    // this.tokenRate = this.company.companyDetails.tokenRate;

    let details = ((await this.userInfoService.userDashBoardDetails()) as any)
      .data.table[0];

    this.TokenBalance = Number(details.mtaTokens);
    this.tokenRate = Number(details.mtaUsdRate);
    // this.sellAmount = this.TokenBalance >= this.maticToToken ? this.maticToToken : this.TokenBalance;
    this.calculateMatic();
  }

  calculateMatic() {
    // if (this.sellAmount > this.TokenBalance * 0.1) {
    //   this.deductionPercentage = 50;
    // }
    // else {
    //   this.deductionPercentage = 10;
    // }
    this.maticAmount_WithoutDeduction = this.sellAmount * this.tokenRate;
    let temp_matic =
      this.sellAmount - (this.sellAmount * this.deductionPercentage) / 100;
    this.maticAmount = temp_matic * this.tokenRate;
  }

  async withdrawMTA() {
    if (this.sellAmount <= this.TokenBalance) {
      if (this.sellAmount > 0) {
        this.spinnerService.show();

        let result: any = await this.fund.withdrawMTA(this.sellAmount);

        this.spinnerService.hide();
        // console.log(x);
        if (result.status) {
          Swal.fire({
            icon: 'success',
            title: result.message,
          }).then(async () => {
            await this.company.getCompanyDetails();
            this.initialize();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: result.message,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Enter a valid amount',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient balance!',
      });
    }
  }

  setAmount(percentage: number) {
    this.sellAmount = Math.floor((this.TokenBalance * percentage) / 100);
    this.calculateMatic();
  }
}
