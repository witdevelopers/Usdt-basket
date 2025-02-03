import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-level-dividend',
  templateUrl: './level-dividend.component.html',
  styleUrls: ['./level-dividend.component.css'],
  standalone: true,

  imports: [FormsModule, CommonModule],
})
export class LevelDividendComponent implements OnInit {
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

  apiMessages: string[] = []; // Array to store all messages from the API response

  constructor(private api: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    if (userType === 'User') {
      this.filterUserId = sessionStorage.getItem('userId');
      this.getLeveldiveidend();
    }
  }

  paymentToken: string = Settings.paymentToken;
  
  ngOnInit(): void {}

  onFilterChange() {
    // Update filteredDirects based on the filter criteria
    this.filteredDirects = this.directs.filter((user) => {
      const matchesStartDate = this.startDate
        ? new Date(user.startDate) >= new Date(this.startDate)
        : true;
      const matchesEndDate = this.endDate
        ? new Date(user.startDate) <= new Date(this.endDate)
        : true;
      return matchesStartDate && matchesEndDate; // && matchesStatus;
      return matchesStartDate && matchesEndDate;
    });
  }

  getLeveldiveidend() {
    this.api
      .levelIncome(this.filterUserId, this.startDate, this.endDate)
      .then((res: any) => {
        // Clear previous messages
        this.apiMessages = [];

        // Access the 'data.table' property from the API response
        const tableData = res?.data?.table;
        const messages = res?.data?.messages;

        // Check if messages exist and populate the apiMessages property
        this.apiMessages = Array.isArray(messages) ? messages : [];

        // Check if tableData exists
        if (tableData) {
          this.directs = tableData;
          this.filteredDirects = [...this.directs]; // Initialize filteredDirects with the full directs
          this.updatePagination();
        } else {
          // If no data, set directs and filteredDirects to empty arrays
          this.directs = [];
          this.filteredDirects = [];
        }

        // Check if there are messages in the response
        if (res?.message) {
          if (Array.isArray(res.message)) {
            this.apiMessages.push(...res.message);
          } else {
            this.apiMessages.push(res.message);
          }
        }
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

  isColumnVisible(columnName: string): boolean {
    return this.filteredDirects.some(item => item[columnName] && item[columnName] !== 0);
  }
  
}
