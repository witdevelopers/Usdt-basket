import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Settings } from 'src/app/app-setting';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leader-ship-income-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './leader-ship-income-details.component.html',
  styleUrl: './leader-ship-income-details.component.css'
})
export class LeaderShipIncomeDetailsComponent {
directs: any[] = [];
  filteredDirects: any[] = []; // To hold the filtered directs
  filterUserId: string = ''; // For filtering by User ID
  startDate: string | null = null; // For filtering by start date
  endDate: string | null = null; // For filtering by end date
  statusFilter: number = -1; // For filtering by status
  sideFilter: number = 0;
  pageNo: number = 1;
  pageSize: number = 10;
  pageCount: number = 0;
  hasNextPage: boolean = false;
  isAdmin: boolean = false;
  hasData: boolean = false;
  UserId: string | null; // Declare UserId here
  isSubmitted: boolean;
  message: string = ''; // To store the message from API response

  constructor(private api: UserService) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (this.isAdmin === false) {
      this.filterUserId = sessionStorage.getItem('address');
      this.GetLeaderShipIncomeDetails();
    }
  }

  paymentToken: string = Settings.paymentToken;
  // Handle filter changes
  onFilterChange() {
    // Update filteredDirects based on the filter criteria
    this.filteredDirects = this.directs.filter((user) => {
      const matchesStartDate = this.startDate
        ? new Date(user.startDate) >= new Date(this.startDate)
        : true;
      const matchesEndDate = this.endDate
        ? new Date(user.startDate) <= new Date(this.endDate)
        : true;
      return matchesStartDate && matchesEndDate;
    });
  }

  // Fetch direct income data from the API
  GetLeaderShipIncomeDetails() {
    this.api
      .GetLeaderShipIncomeDetails(this.filterUserId, this.startDate, this.endDate)
      .then((res: any) => {
        const tableData = res?.data?.table;
        if (tableData && Array.isArray(tableData)) {
          this.directs = tableData;
          this.filteredDirects = [...this.directs]; // Initialize filteredDirects with the full directs
          this.updatePagination();
          this.message = res?.message || ''; // Set dynamic message from API response
        } else {
          this.directs = [];
          this.filteredDirects = [];
          this.message = res?.message || 'No data found'; // Set no data message dynamically from API
        }
      })
      .catch((error) => {
        console.error('Error fetching direct income:', error);
        this.message =
          'Error occurred while fetching data. Please try again later.'; // Set error message dynamically
      });
  }

  // Pagination logic
  updatePagination() {
    this.pageCount = Math.ceil(this.filteredDirects.length / this.pageSize);
    this.hasNextPage = this.pageNo < this.pageCount;
    this.filteredDirects = this.filteredDirects.slice(
      (this.pageNo - 1) * this.pageSize,
      this.pageNo * this.pageSize,
    );
  }

  OnPreviousClick() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.updatePagination();
    }
  }

  OnNextClick() {
    if (this.hasNextPage) {
      this.pageNo++;
      this.updatePagination();
    }
  }

  OnPageNoChange() {
    if (this.pageNo >= 1 && this.pageNo <= this.pageCount) {
      this.updatePagination();
    }
  }

  ngOnInit(): void {}
}
