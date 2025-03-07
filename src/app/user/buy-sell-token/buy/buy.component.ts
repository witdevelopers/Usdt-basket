import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import { CompanyService } from 'src/app/services/company.service';
import { FormsModule } from '@angular/forms';
import { ValidationMessageComponent } from '../../../validation-message/validation-message.component';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FundService } from '../../services/fund.service';
import { UserService } from '../../services/user.service';

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
  CheckForPoolUpgrade:boolean;
  Amount: number = 1;
  tokenAmount: number = 0;
  tokenSymbol: string = Settings.coinSymbol;
  Balance: number = 0;
  tokenAmount_WithoutDeduction: number = 0;
  packages: any[] = [];
  packageId: number | null = null;
  ToToken: number = 0;
  selectedPackage: any;
  userId: string; 
  isAdmin:any;
  sponsorId: string = '';
  paymentToken: string = Settings.paymentToken;
  
  constructor(
    private spinnerService: NgxSpinnerService,
    private fund: FundService,
    private company: CompanyService,
    private contractService: ContractService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (!this.isAdmin) {
      this.userId = sessionStorage.getItem('address');
    }
    await this.initialize();
  }

  async initialize() {
    this.ToToken = 1 / this.company.companyDetails.tokenRate;
    this.Balance = await this.contractService.fetchAddressBalance();
    await this.fetchPackages();
    this.calculateTokens();
    console.log("API userId:",this. userId);
    const res = await this.userService.CheckForPoolUpgrade(this.userId).toPromise();
      console.log("API Response:", res.data.table[0].status);
    
      this.CheckForPoolUpgrade = res?.status && res?.data?.table?.length 
        ? res.data.table[0].status === "TRUE" 
        : false;
    
  }

  async fetchPackages() {
    this.spinnerService.show();
    const response = await this.userService.nextPool(this.userId).toPromise();
    this.spinnerService.hide();

    if (response && response.status) {
      this.packages = response.data?.table?.map((item: any) => ({
        poolName: item.poolName,  
        nextPool: item.nextPool,  
        amount: item.amount,
        packageId: item.nextPool
      })) || [];

      if (this.packages.length > 0) {
        this.selectPackage(response.data.table[0].nextPool);
      }
    } else {
      Swal.fire({ icon: "error", title: "Failed to load packages", text: response?.message || "Unknown error" });
    }
  }

  calculateTokens() {
    const temp_ = this.Amount * 0.6;
    this.tokenAmount = temp_ * this.ToToken;
    this.tokenAmount_WithoutDeduction = this.Amount * this.ToToken;
  }

  selectPackage(nextPoolValue: number) {
    this.selectedPackage = this.packages.find((pkg: any) => pkg.nextPool === nextPoolValue);

    if (this.selectedPackage) {
      this.Amount = this.selectedPackage.amount;
      this.packageId = this.selectedPackage.packageId;
      this.calculateTokens();
    }
  }

  async onPackageChange() {
    if (this.selectedPackage) {
      this.Amount = this.selectedPackage.amount;
      this.packageId = this.selectedPackage.packageId;
      this.calculateTokens();
    }
  }

  async buy() {
    if (!this.packageId) {
      Swal.fire({ icon: "error", title: "No package selected!", text: "Please ensure the amount is within a valid range." });
      return;
    }

    const userBalance = await this.contractService.fetchUSDTBalance();
    if (this.Amount >= userBalance) {
      Swal.fire({ icon: "error", title: "Insufficient balance!" });
      return;
    }

    if (this.Amount <= 0) {
      Swal.fire({ icon: "error", title: "Enter a valid amount" });
      return;
    }

    this.spinnerService.show();
    if (!this.sponsorId) {
      this.sponsorId = Settings.DefaultSponsor;
    }

    const receipt = await this.contractService.buyToken(this.Amount, this.sponsorId);

    if (receipt.success) {
      const result: any = await this.fund.invest(receipt.data.transactionHash, this.Amount, this.packageId);

      if (result.status) {
        Swal.fire({ icon: "success", title: "Deposit successful!" }).then(async () => {
          await this.company.getCompanyDetails();
          await this.initialize();
        });
      } else {
        Swal.fire({ icon: "success",title: result.message });
      }
    } else {
      Swal.fire({ icon: "error", title: "Transaction failed!", text: receipt.message });
    }
    
    this.spinnerService.hide();
  }

  async setAmount(percentage: number) {
    this.Amount = (this.Balance * percentage) / 100;
    this.calculateTokens();
  }
}
