import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topup-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topup-details.component.html',
  styleUrls: ['./topup-details.component.css'],
})
export class TopupDetailsComponent implements OnInit {
  selectedUserType: string = 'UserTopup'; // default
  userId: string | null; // Default empty for Admin
  topupBy: string | null = '';
  userIdForDownlineTopup: string | null;
  isAdmin: boolean = false;
  incomeData: any[] = []; // Initialize an array to hold the income data
  directs: any[] = [];
  filteredDirects: any[] = []; // To hold the filtered directs
  filterUserId: string; // For filtering by User ID
  startDate: string | null = null; // For filtering by start date
  endDate: string | null = null; // For filtering by end date
  statusFilter: number = -1; // For filtering by status
  sideFilter: number = 0;
  pageindex: number = 0; // Ensure page starts at 1
  pageSize: number = 100;
  pageCount: number = 0;
  hasNextPage: boolean = false;
  ByAdminidMemberid: any = 0;
  hasData: boolean = false;
  inputUserId: string | null; // For Admin to manually input User ID
  selectedTopUpType: string = 'All' === 'All' ? '' : 'someOtherValue';
  noDataMessage: string = '';
  today: string;


  
  constructor(private userService: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isAdmin = userType === 'Admin'; // Show only if the user is Admin

    // const now = new Date();
    this.today = this.formatDate(new Date());
    
  }
  
  isToday(topupDate: string): boolean {
    const datePart = topupDate.split(' ')[0];
    return datePart === this.today;
  }
  

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnInit(): void {
    const userType = sessionStorage.getItem('usertype');

    if (userType === 'Admin') {
      this.ByAdminidMemberid = sessionStorage.getItem('adminId'); 
      this.userId = '';
      this.topupBy = null;
      this.userIdForDownlineTopup = null;
    } else {
      this.userId = sessionStorage.getItem('userId');
      this.topupBy = sessionStorage.getItem('userId');
      this.userIdForDownlineTopup = sessionStorage.getItem('userId');
    }
  }

  onUserTypeChange(selectedType: string) {
    this.selectedUserType = selectedType;
  }

  onSubmit() {
    let userIdToUse: string = '';
    // Determine the User ID to use based on conditions
    if (this.isAdmin && this.inputUserId) {
      userIdToUse = this.inputUserId; // Admin-provided User ID
    } else {
      if (this.selectedUserType === 'UserTopup') {
        userIdToUse = this.userId;
      } else if (this.selectedUserType === 'TopupByUser') {
        userIdToUse = this.topupBy;
      } else if (this.selectedUserType === 'UserDownlineTopup') {
        userIdToUse = this.inputUserId || this.userIdForDownlineTopup;
      }
    }

    // Check for Admin or valid User ID
    if (this.isAdmin || userIdToUse) {
      const userIdForDownline =
        this.selectedUserType === 'UserDownlineTopup' ? userIdToUse : null;

      this.userService
        .getTopupDetails(
          userIdToUse,
          this.selectedUserType,
          this.selectedTopUpType,
          this.startDate,
          this.endDate,
          userIdForDownline,
          this.pageindex, // Use the updated pageindex directly here
          this.pageSize // Ensure pageSize is passed for pagination
        )
        .subscribe(
          (response) => {
            if (response.status) {
              this.incomeData = response.data.table;
              this.updatePagination(response.data.table); // Update pagination
              this.noDataMessage = ''; // Clear any previous message
            } else {
              this.noDataMessage =
                response.data?.table?.[0]?.message ||
                'No topup details found for the selected criteria.';
            }
          },
          (error) => {
            this.noDataMessage =
              error?.message ||
              'An error occurred while fetching topup details.';
          }
        );
    } else {
      this.noDataMessage = 'No valid User ID found for the operation.';
    }
  }

  updatePagination(data: any[]) {
    this.pageCount = Math.ceil(data.length / this.pageSize);
    this.hasNextPage = this.pageindex < this.pageCount;
    this.filteredDirects = data.slice(
      (this.pageindex - 1) * this.pageSize,
      this.pageindex * this.pageSize
    );
  }

  OnNextClick() {
    if (this.hasNextPage) {
      this.pageindex++; // Increment pageindex
      this.onSubmit(); // Directly fetch data with updated pageindex
    }
  }

  OnPreviousClick() {
    if (this.pageindex > 0) {
      this.pageindex--; // Decrement pageindex
      this.onSubmit(); // Directly fetch data with updated pageindex
    }
  }

  toggleROIBlocked(pinSrno: number, isROIBlocked: boolean, ByAdmin: number) {
    const newStatus = !isROIBlocked;

    const userIndex = this.incomeData.findIndex(
      (user) => user.pinSrno === pinSrno
    );
    if (userIndex !== -1) {
      this.incomeData[userIndex].isROIBlocked = newStatus;
    }

    this.userService.BlockUnblockROI(pinSrno, ByAdmin).subscribe({
      next: (response) => {
        if (response.status) {
          this.onSubmit();
        } else {
          this.incomeData[userIndex].isROIBlocked = isROIBlocked;
        }
      },
      error: (error) => {
        this.incomeData[userIndex].isROIBlocked = isROIBlocked;
      },
    });
  }

  DeleteTopupDetails(pinSrno: number, ByAdminidMemberid: number) {
    this.userService.DeleteTopup(pinSrno, this.ByAdminidMemberid).subscribe({
      next: (response) => {
        if (response.status) {
          alert(response.data.table[0].message);
          this.onSubmit();
        } else {
          alert(response.data.table[0].message);
        }
      },
    });
  }

  onUserTopUpTypeChange(event: Event) {
    const selectedType = (event.target as HTMLSelectElement).value;
    this.selectedTopUpType = selectedType === 'All' ? '' : selectedType;
    this.onSubmit();
  }
}
