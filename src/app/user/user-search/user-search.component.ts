import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css'],
})
export class UserSearchComponent {
  userId: string = '';
  name: string = '';
  mobileNo: string = '';
  topupStatus: string = ''; // or number, depending on your API
  blockedStatus: string = ''; // or number, depending on your API
  fromDate: string = '';
  toDate: string = '';
  userData: any[] = [];
  isLoading = false;

  constructor(private userService: UserService) { }

  async search() {
    this.isLoading = true;

    // Set default values to -1 if topupStatus or blockedStatus are not provided
    const topupStatusValue = this.topupStatus ? +this.topupStatus : -1;
    const blockedStatusValue = this.blockedStatus ? +this.blockedStatus : -1;

    // Call searchUser function with form values, applying default values
    this.userService
      .searchUser(
        this.userId || undefined,
        this.name || undefined,
        this.mobileNo || undefined,
        topupStatusValue,
        blockedStatusValue,
        this.fromDate || undefined,
        this.toDate || undefined,
      )
      .subscribe({
        next: (response) => {
          this.userData = response?.data?.table || []; // Update based on response structure
          // console.log('User search results:', response);
        },
        error: (error) => {

        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

// Component Method
toggleBlockStatus(memberId: number) {
  const isByAdmin = 1;  // Indicates the action is performed by an admin
  this.userService.blockUnblockUserStatus(memberId, isByAdmin).subscribe({
    next: (response) => {
      if (response.status) {
        this.search();  // Refresh the user data
      } else {
      }
    },
    error: (error) => {
    }
  });
}

}
