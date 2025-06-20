import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-level-income-details-matrix',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './level-income-details-matrix.component.html',
  styleUrl: './level-income-details-matrix.component.css'
})
export class LevelIncomeDetailsMatrixComponent implements OnInit {

  incomeForm!: FormGroup;
  incomeData: any[] = [];
statusFlag: boolean = true;
statusMessage: string = '';
  isAdmin: boolean = false;
  userID: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {}

ngOnInit(): void {
  this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  this.userID = sessionStorage.getItem('address') ;

  // Build form: include userID field only if isAdmin
  this.incomeForm = this.fb.group({
    ...(this.isAdmin ? { userID: [''] } : {}),
    fromDate: [''],
    toDate: ['']
  });

  // Auto-fetch for non-admins
  if (!this.isAdmin && this.userID) {
    this.fetchIncomeData();
  }
}


fetchIncomeData(): void {
  const { fromDate, toDate, userID: formUserID } = this.incomeForm.value;
  const finalUserID = this.isAdmin ? formUserID?.trim() : this.userID;

  if (!finalUserID) return;



  this.userService.getLevelIncomeDetailsMatrix(finalUserID, fromDate, toDate).subscribe({
    next: (res) => {
      this.statusFlag = res?.status === true;
      this.statusMessage = res?.message || 'No data found!';
      this.incomeData = res?.data?.table || [];
     
    },
    error: (err) => {
      this.statusFlag = false;
      this.statusMessage = 'Server error. Please try again.';
     
    }
  });
}

}
