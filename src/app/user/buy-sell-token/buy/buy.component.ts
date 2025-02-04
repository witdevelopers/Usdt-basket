import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { FundService } from '../../services/fund.service';
import { FormsModule } from '@angular/forms';

import { ValidationMessageComponent } from '../../../validation-message/validation-message.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ValidationMessageComponent,
    MatSelectModule
  ],
})
export class BuyComponent implements OnInit {

  Amount: number = 1;
  tokenAmount: number = 0;
  tokenSymbol: string = Settings.coinSymbol;
  Balance: number = 0;
  tokenAmount_WithoutDeduction: number = 0;
  packages: any[] = [];
  packageId: number | null = null;
  ToToken: number = 0;
  selectedPackage: any;
  constructor(
    private spinnerService: NgxSpinnerService,
    private fund: FundService,
    private company: CompanyService,
    private contractService: ContractService
  ) {
    this.packages = this.company.packages;
    this.initialize();
  }

  ngOnInit(): void { }

  async initialize() {
    this.ToToken = 1 / this.company.companyDetails.tokenRate;
    this.Balance = await this.contractService.fetchAddressBalance();
    this.selectPackage();
    this.calculateTokens();
  }

  calculateTokens() {
    const temp_ = this.Amount * 0.6;
    this.tokenAmount = temp_ * this.ToToken;
    this.tokenAmount_WithoutDeduction = this.Amount * this.ToToken;
  }

  selectPackage() {
    this.selectedPackage = this.packages.find((pkg: any) => {
      const withinMinRange = this.Amount >= pkg.minRange;
      const withinMaxRange = pkg.maxRange === -1 || this.Amount <= pkg.maxRange;
      return withinMinRange && withinMaxRange;
    });

    if (!this.selectedPackage) {
      console.warn("No package matches the current Amount.");
    }
  }

  async onPackageChange(): Promise<void> {
    if (this.selectedPackage) {
      this.Amount = this.selectedPackage.minRange; // Set amount to minRange of selected package
      this.packageId = this.selectedPackage.srno; // Update packageId
      this.updateMaxAmount();
    } else {
      this.packageId = null; // Clear packageId if no package is selected
    }
  }

  async updateMaxAmount(): Promise<void> {
    const amountInput = document.getElementById('txtAmount') as HTMLInputElement;
    amountInput?.setAttribute('max', `${this.selectedPackage?.maxRange ?? 0}`);
  }
  
  async buy() {
    this.selectPackage();

    if (!this.packageId) {
      Swal.fire({
        icon: "error",
        title: "No package selected!",
        text: "Please ensure the amount is within a valid range."
      });
      return;
    }

    if (this.Amount < (await this.contractService.fetchUSDTBalance())) {
      if (this.Amount > 0) {
        this.spinnerService.show();

        try {
          const receipt = await this.contractService.buyToken(this.Amount);

          if (receipt.success) {
            const result: any = await this.fund.invest(receipt.data.transactionHash,this.Amount, this.packageId );

            if (result.status) {
              Swal.fire({
                icon: "success",
                title: "Deposit successful!"
              }).then(async () => {
                await this.company.getCompanyDetails();
                this.initialize();
              });
            } else {
              Swal.fire({ title: result.message });
            }
          } else {
            Swal.fire({
              icon: "error",
              title: "Transaction failed!",
              text: receipt.message
            });
          }
        } catch (error: any) {
          console.error("Buy Error:", error);
          Swal.fire({
            icon: "error",
            title: "Transaction failed!",
            text: error.message
          });
        } finally {
          this.spinnerService.hide();
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Enter a valid amount"
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Insufficient balance!"
      });
    }
  }

  setAmount(percentage: number) {
    this.Amount = (this.Balance * percentage) / 100;
    this.calculateTokens();
  }
}
