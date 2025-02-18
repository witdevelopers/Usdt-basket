import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-club-income',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './club-income.component.html',
  styleUrl: './club-income.component.css'
})
export class ClubIncomeComponent {
  isAdmin: boolean;
  clubIncome: any[] = [];
  filteredclub: any[] = [];
  isSubmitted: boolean = false;
  filterUserId: string = '';

  constructor(private api: UserService, private fb: FormBuilder) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    this.filterUserId = this.isAdmin ? '' : sessionStorage.getItem('address') || '';
    this.GetClubincome();
  }

  GetClubincome() {
    this.isSubmitted = true;
    if (!this.filterUserId) {
      return;
    }
  
    this.api.GetClubincome(this.filterUserId).subscribe((res: any) => {
      const tableData = res?.data?.table1;
  
      if (tableData) {
        this.filteredclub = tableData; // ✅ Directly assigning data without filtering
      } else {
        this.filteredclub = [];
      }
    });
  }
}
