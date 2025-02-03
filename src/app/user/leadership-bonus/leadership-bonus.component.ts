
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-team-bonus',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './leadership-bonus.component.html',
  styleUrl: './leadership-bonus.component.css'
})
export class LeadershipBonusComponent implements OnInit {
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
  isVisible: boolean = false;
  hasData: boolean = false;
  UserId: string | null; // Declare UserId here
  isSubmitted: boolean;
  apiMessages: string[] = []; // Array to hold all messages from the API response

  constructor(private api: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    if (userType === 'User') {
      this.filterUserId = sessionStorage.getItem('userId')!;
      this.getRoiIncome();
    }
  }

  ngOnInit(): void {}

  paymentToken: string = Settings.paymentToken;


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

  getRoiIncome() {
    this.api
      .leadershipbonus(this.filterUserId, this.startDate, this.endDate)
      .then((res: any) => {
        // Access the 'data.table' property from the API response
        const tableData = res?.data?.table;
        // Clear previous messages
        this.apiMessages = [];
        if (res?.message) {
          // Store all response messages (if any)
          this.apiMessages.push(res.message);
        }

        if (tableData) {
          this.directs = tableData;
          this.filteredDirects = [...this.directs]; // Initialize filteredDirects with the full directs
          this.updatePagination();
        } else {
          // If no data, set directs and filteredDirects to empty arrays
          this.directs = [];
          this.filteredDirects = [];
        }
      })
      .catch((error) => {
        console.error('Error fetching directs:', error);
        this.directs = [];
        this.filteredDirects = [];
        this.apiMessages.push('Error fetching data');
      });
  }

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
}

