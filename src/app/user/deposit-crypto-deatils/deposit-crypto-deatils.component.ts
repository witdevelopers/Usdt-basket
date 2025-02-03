import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-deposit-crypto-deatils',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './deposit-crypto-deatils.component.html',
  styleUrls: ['./deposit-crypto-deatils.component.css'],
})
export class DepositCryptoDeatilsComponent implements OnInit {
  userId: string = '';
  depositData: any[] = [];
  isAdmin: boolean = false ;

  constructor(private userService: UserService) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
     if (this.isAdmin) {
      this.userId = '';
    } else {
      this.userId = sessionStorage.getItem('address');
    }
    this.loadUserCryptoDeposits();

  }

  ngOnInit(): void {
  }


  loadUserCryptoDeposits(): void {
    this.userService.getUserCryptoDeposits(this.isAdmin === false ? this.userId : '').subscribe({
      next: (response) => {
        if (response?.status && response?.data?.table) {
          this.depositData = response.data.table;
        } else {
          this.depositData = []; 
        }
      },
      error: (err) => {
        console.error('API call error:', err);
      },
    });
  }
}
