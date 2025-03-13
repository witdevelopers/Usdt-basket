import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';
import { CommonModule, NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Subscription } from 'rxjs';
import { FundService } from 'src/app/user/services/fund.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationMessageComponent,
    NgStyle,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  erc20Transfers: any[] = [];
  txHash = ''; 
  account: string = '';
  isLoading: boolean = false;
  private _subscription: Subscription | undefined;
transactionData: any;
  isPopupOpen: boolean;

  constructor(private fundService: FundService,
    private contractService: ContractService,
    private router: Router,
    private api: AuthService,
    private Loader: LoaderService
  ) {
    this.getAddress();
  }

  ngOnInit(): void {}


  
  async getAddress() {
    try {
      this.account = await this.contractService.getAddress();
      this._subscription = this.contractService.accountChange.subscribe(
        (value) => {
          this.account = value || '';
        }
      );
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  }

  async connect() {
    await this.getAddress();
  }

  async login() {
    this.Loader.show();
    try {
      const signature = await this.contractService.signMessage('Do you want to login?');
      console.log('Generated Signature:', signature);

      if (signature) {
        const res: any = await this.api.login(this.account, signature);

        if (res.status) {
          sessionStorage.setItem('address', this.account);
          sessionStorage.setItem('token', res.data);
          sessionStorage.setItem('isAdmin', res.isAdmin?.toString());

          this.router.navigate(['usershop/affiliate']);
        } else {
          Swal.fire(res.message, '', 'error');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire('Failed to sign message!', '', 'error');
    } finally {
      this.Loader.hide();
    }
  }

  async demoLogin() {
    this.Loader.show();
    try {
      const signature =
        '0xda7ff5b62b6e36228461fd87bf9c6cab3ee57e3a838dd87f58dff265de200184216e925c214da2a97ed3139118a854718a3f998fcae7eacc89e7eb5a8d05875c1b';
      const address = 'TSw3n3Tb2gTmKfENjTLVi65AbscuHPpBnr';
      const res: any = await this.api.login(address, signature);

      if (res.status) {
        sessionStorage.setItem('address', address);
        sessionStorage.setItem('token', res.data);
        this.router.navigate(['usershop/affiliate']);
      } else {
        Swal.fire(res.message, '', 'error');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      Swal.fire('Demo login failed!', '', 'error');
    } finally {
      this.Loader.hide();
    }
  }

  registerClick() {
    this.router.navigate(['auth/register']);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  async Submit() {
    if (!this.txHash) return;
  
    this.closePopup(); 
    const txHash = this.txHash; 
    this.txHash = ''; 
  
    this.transactionData = await this.fundService.fetchTransactionDetails(txHash);
  
    if (this.transactionData && this.transactionData.apiResponses.length > 0) {
      const apiResponse = this.transactionData.apiResponses.find(
        (res: any) => res?.status === true && res?.data?.table?.length > 0
      );
  
      if (apiResponse) {
        const tableEntry = apiResponse.data.table[0];
        var message = tableEntry?.msg || tableEntry?.message ;
  
        Swal.fire({
          icon: tableEntry.status === 'TRUE' ? 'success' : 'error',
          text: message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          text: 'Submission failed!',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'No transaction data found!',
      });
    }
  }
  
  openPopup() {
    this.txHash = ''; 
    this.isPopupOpen = true;
  }
  
  closePopup() {
    this.isPopupOpen = false;
  }  
}