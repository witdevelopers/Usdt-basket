import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-matching-income',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matching-income.component.html',
  styleUrls: ['./matching-income.component.css'],
})
export class MatchingIncomeComponent {
  binaryIncomeData: any;
  errorMessage: string | null = null;
  successMessage: string | null = null; // To store success messages
  userType: string | null = null;
  userIdForAdmin: string = ''; // For Admin input
  payoutNo: number = 1; // Default Payout number
  isSubmitted: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Get the userType from session storage
    this.userType = sessionStorage.getItem('usertype');
  }

  getBinaryIncomeData(): void {
    let userId: string | null = null;

    // Check userType to decide where to take the userId from
    if (this.userType === 'User') {
      userId = sessionStorage.getItem('userId'); // Get userId from sessionStorage if userType is 'User'
    } else if (this.userType === 'Admin') {
      userId = this.userIdForAdmin; // Get userId from input field if userType is 'Admin'
    }

    if (userId) {
      this.userService.getBinaryIncome(userId, this.payoutNo).subscribe(
        (response) => {
          this.binaryIncomeData = response; // Store the data
          this.successMessage =
            response?.message || 'Data fetched successfully'; // Store success message from API
          console.log('Binary Income Data:', response);
          this.errorMessage = null; // Clear any previous error messages
        },
        (error) => {
          this.errorMessage = 'Error fetching binary income data';
          this.successMessage = null; // Clear any previous success messages
          console.error('Error fetching binary income', error);
        },
      );
    } else {
      this.errorMessage = 'User ID is required';
      this.successMessage = null; // Clear any previous success messages
    }
  }
}
