import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-directs',
  templateUrl: './directs.component.html',
  styleUrls: ['./directs.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class DirectsComponent implements OnInit {
  directs: any[] = [];
  filteredDirects: any[] = []; // To hold the filtered directs
  filterUserId: string = ''; // For filtering by User ID
  startDate: string | null = null; // For filtering by start date
  endDate: string | null = null; // For filtering by end date
  statusFilter: number = -1; // For filtering by status
  sideFilter: number = 0;
  pageNo: number = 1;
  pageSize: number = 100;
  pageCount: number = 0;
  hasNextPage: boolean = false;
  isAdmin: boolean = false;
  hasData: boolean = false;
  isSubmitted: boolean = false;
  isBinary: boolean = false;

  constructor(private api: UserService) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (!this.isAdmin) {
      this.filterUserId = sessionStorage.getItem('address');
      this.getDirects();
    }
  }

  ngOnInit(): void { }

  onFilterChange() {
    // Update filteredDirects based on the filter criteria
    this.filteredDirects = this.directs.filter((user) => {
      const matchesStartDate = this.startDate
        ? new Date(user.topupDate) >= new Date(this.startDate)
        : true;
      const matchesEndDate = this.endDate
        ? new Date(user.topupDate) <= new Date(this.endDate)
        : true;
      const matchesStatus =
        this.statusFilter !== -1
          ? user.status === Number(this.statusFilter)
          : true; // Adjust as per your user object structure
      return matchesStartDate && matchesEndDate && matchesStatus;
    });

    // Reset to the first page whenever the filter changes
    this.pageNo = 1;
    this.updatePagination();
  }

  getDirects() {
    this.isSubmitted = true;
    if (!this.filterUserId) {
      return;
    }
    this.api
      .directs(
        this.filterUserId,
        this.startDate,
        this.endDate,
        this.statusFilter,
        this.sideFilter,
      )
      .then((res: any) => {
        // Access the 'data.table' property from the API response
        const tableData = res?.data?.table;

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
      })
      .catch((error) => {
        console.error('Error fetching directs:', error);
        // Handle error scenario here (e.g., set to empty arrays)
        this.directs = [];
        this.filteredDirects = [];
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
