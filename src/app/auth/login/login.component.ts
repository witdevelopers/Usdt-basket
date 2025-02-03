import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contract.service';
// import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidationMessageComponent } from '../../validation-message/validation-message.component';
import { NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2/dist/sweetalert2.all';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationMessageComponent,
    NgStyle,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  account: any = '';
  _subscription: any;

  constructor(
    private contractService: ContractService,
    private router: Router,
    private api: AuthService,
    private spinnerService: NgxSpinnerService,
  ) {
    this.getAddress();
  }

  ngOnInit(): void {}

  async getAddress() {
    this.account = await this.contractService.getAddress();
    this.account =
      this.account != undefined && this.account != null ? this.account : '';
    // this._subscription = this.contractService.accountChange.subscribe(
    //   (value) => {
    //     this.account = value != undefined && value != null ? value : '';
    //   }
    // );
  }

  async connect() {
    await this.getAddress();
  }

  async login() {
    this.spinnerService.show();
    let signature = await this.contractService.signMessage(
      'Do you want to login?',
    );
    console.log(signature);
    if (signature) {
      var res: any = await this.api.login(this.account, signature);
      //console.log(x);
      if (res.status) {
        sessionStorage.setItem('address', this.account);
        sessionStorage.setItem('token', res.data);
        sessionStorage.setItem('isAdmin', res.isAdmin?.toString());

        this.spinnerService.hide();
        this.router.navigate(['usershop/affiliate']);
      } else {
        this.spinnerService.hide();
        Swal.fire(res.message, '', 'error');
      }
    }
  }

  async demoLogin() {
    let signature =
      '0xda7ff5b62b6e36228461fd87bf9c6cab3ee57e3a838dd87f58dff265de200184216e925c214da2a97ed3139118a854718a3f998fcae7eacc89e7eb5a8d05875c1b';
    let address = 'TSw3n3Tb2gTmKfENjTLVi65AbscuHPpBnr';
    var res: any = await this.api.login(address, signature);
    //console.log(x);
    if (res.status) {
      sessionStorage.setItem('address', address);
      sessionStorage.setItem('token', res.data);

      this.spinnerService.hide();
      this.router.navigate(['usershop/affiliate']);
    } else {
      this.spinnerService.hide();
      Swal.fire(res.message, '', 'error');
    }
  }

  registerClick() {
    this.router.navigate(['auth/register']);
  }

  ngOnDestroy() {
    // this._subscription.unsubscribe();
  }
}
