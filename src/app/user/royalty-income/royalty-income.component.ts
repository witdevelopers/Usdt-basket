import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-royalty-income',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './royalty-income.component.html',
  styleUrl: './royalty-income.component.css',
})
export class RoyaltyIncomeComponent {
  isAdmin: boolean;
  royaltyIncome: any[] = []; // ✅ Fixed variable name
  filteredRoyalty: any[] = [];
  isSubmitted: boolean = false;
  filterUserId: string = '';

  constructor(private api: UserService, private fb: FormBuilder) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    this.filterUserId = this.isAdmin ? '' : sessionStorage.getItem('address') || '';
    this.GetRoyaltyIncome();
  }

  GetRoyaltyIncome() {
    this.isSubmitted = true;
    if (!this.filterUserId) {
      return;
    }
  
    this.api.getroyaltyincome(this.filterUserId).subscribe((res: any) => {
      const tableData = res?.data?.table1;
  
      if (tableData) {
        this.filteredRoyalty = tableData; // ✅ Directly assigning data without modification
      } else {
        this.filteredRoyalty = [];
      }
    });
  }
  
}
