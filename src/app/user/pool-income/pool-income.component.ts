import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-pool-income',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pool-income.component.html',
  styleUrl: './pool-income.component.css'
})
export class PoolIncomeComponent {
  isAdmin: boolean;
  pool: any[] = []; // ✅ Fixed
  filteredpool: any[] = [];
  isSubmitted: boolean = false;
  filterUserId: string = '';
  paymentToken: string = Settings.paymentToken;
  
  constructor(private api: UserService, private fb: FormBuilder) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    this.filterUserId = this.isAdmin ? '' : sessionStorage.getItem('address') || '';
    this.GetpoolIncome();
  }

  GetpoolIncome() {
    this.isSubmitted = true;
    if (!this.filterUserId) {
      return;
    }
  
    this.api.GetAllIncomepool(this.filterUserId).subscribe((res: any) => {
      const tableData = res?.data?.table;
  
      if (tableData) {
        this.filteredpool = tableData; // ✅ Directly assign the data without modification
      } else {
        this.filteredpool = [];
      }
    });
  }
  
}
