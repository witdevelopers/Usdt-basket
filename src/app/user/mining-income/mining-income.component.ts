import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Settings } from 'src/app/app-setting';

@Component({
  selector: 'app-mining-income',
  templateUrl: './mining-income.component.html',
  styleUrls: ['./mining-income.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class MiningIncomeComponent implements OnInit {
  directs: any[] = [];
  filteredDirects: any[] = [];
  filterUserId: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  statusFilter: number = -1;
  sideFilter: number = 0;
  pageNo: number = 1;
  pageSize: number = 100;
  pageCount: number = 0;
  hasNextPage: boolean = false;
  isVisible: boolean = false;
  hasData: boolean = false;
  UserId: string | null;
  isSubmitted: boolean;
  apiMessages: string[] = [];

  constructor(private api: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    if (userType === 'User') {
      this.filterUserId = sessionStorage.getItem('userId')!;
      this.getProfitincome();
    }
  }

  paymentToken: string = Settings.paymentToken;

  ngOnInit(): void {}

  onFilterChange() {
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

  getProfitincome() {
    this.api
      .profitincome(this.filterUserId, this.startDate, this.endDate)
      .then((res: any) => {
        const tableData = res?.data?.table;
        this.apiMessages = [];
  
        if (res?.message) {
          this.apiMessages.push(res.message);
        }
  
        if (tableData) {
          this.directs = tableData;
          this.filteredDirects = [...this.directs];
          this.updatePagination();
          // No need to call `checkColumnVisibility()` here anymore
        } else {
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
      this.pageNo * this.pageSize
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

  // Method to check if a column should be visible
  isColumnVisible(columnName: string): boolean {
    return this.filteredDirects.some(item => item[columnName] && item[columnName] !== 0);
  }
}
