import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { Settings } from 'src/app/app-setting';
import { AuthService } from '../auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { CommonModule, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from 'src/app/validation-message/validation-message.component';
import { MatSelectModule } from '@angular/material/select';
import { LoaderService } from 'src/app/services/loader.service';
import { FundService } from 'src/app/user/services/fund.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    ValidationMessageComponent,
    NgStyle,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class RegisterComponent implements OnInit {

  account: string = '';
  sponsorId: string = '';
  amount: number = 4;
  _subscription: any;
  maticToToken: any;
  tokenSymbol: string = "";
  packages: any[] = [];
  selectedPackage: any;

  constructor(private contractService: ContractService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: LoaderService,
    private company: CompanyService,
    private fundapi: FundService,
    private api: AuthService) {

    this.getAddress();
  }

  async ngOnInit() {
    this.tokenSymbol = Settings.coinSymbol;
    this.sponsorId = this.activatedRoute.snapshot.paramMap.get("id")!;

    await this.initializeCompanyDetails();
  }

  async initializeCompanyDetails(): Promise<void> {
    await this.company.getCompanyDetails();
    this.packages = this.company.packages;
  }

  async onPackageChange(): Promise<void> {
    this.amount = this.selectedPackage?.minRange ?? 0;
    this.updateMaxAmount();
  }

  async updateMaxAmount(): Promise<void> {
    const amountInput = document.getElementById('txtAmount') as HTMLInputElement;
    amountInput?.setAttribute('max', `${this.selectedPackage?.maxRange ?? 0}`);
  }

  async connect() {
    await this.getAddress();
  }

  async getAddress() {
    this.account = await this.contractService.getAddress();
    this.account = (this.account != undefined && this.account != null) ? this.account : '';
    this._subscription = this.contractService.accountChange.subscribe((value) => {
      this.account = value != undefined && value != null ? value : '';
    });
  }

  async register() {

    await this.getAddress();

    // if (!this.sponsorId) {
    //   this.sponsorId = Settings.DefaultSponsor;
    // }

    if (!this.sponsorId) {
      Swal.fire({
        icon: 'warning',
        text: 'Please enter a valid sponsor ID.',
        confirmButtonText: 'OK'
      });
      return; 
    }

    const usdtBalance = await this.contractService.fetchUSDTBalance();

    if (this.amount <= usdtBalance) {
      if (this.amount > 0) {
        this.spinnerService.show();

        let sponsorRes: any = await this.api.isSponsorValid(this.sponsorId);
        if (!sponsorRes.status) {
          // this.spinnerService.hide();
          Swal.fire({
            icon: "error",
            title: sponsorRes.message
          });
          return;
        }

        let userRes: any = await this.api.isSponsorValid(this.account);
        if (userRes.status) {
          // this.spinnerService.hide();
          Swal.fire({
            icon: "error",
            title: "You are already registered!"
          });
          return;
        }


        let receipt = await this.contractService.register(this.sponsorId, this.amount);
        let sponsorIncomeRes = await this.fundapi.CheckSponsorIncome(this.sponsorId);
        let requestId = sponsorIncomeRes?.data?.table?.[0]?.requestID;

        if (receipt.success) {
          let transactionHash = receipt.data?.transactionHash || receipt.data?.hash;

          let result: any = await this.api.register(this.sponsorId, this.amount, transactionHash , requestId);

          this.spinnerService.hide();

          if (result.status === "TRUE") {
            Swal.fire({
              icon: "success",
              title: '✅ Deposit Successful!',
            }).then(async () => {
              this.loginClick();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: result.message
            });
          }
        } else {
          this.spinnerService.hide();
          Swal.fire({
            icon: "error",
            title: '❌ Transaction failed!'
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: '⚠ Enter a valid amount!'
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: '❌ Insufficient balance!'
      });
    }
  }

  loginClick() {
    this.router.navigate(['auth/login']);
  }

  addAmount(amt: number) {
    this.amount += amt;
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
