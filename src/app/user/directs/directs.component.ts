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
  isAdmin: boolean = false;
  hasData: boolean = false;
  isSubmitted: boolean = false;
  isBinary: boolean = false;
  responseMessage: string;

  constructor(private api: UserService) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    if (!this.isAdmin) {
      this.filterUserId = sessionStorage.getItem('address');
      this.getDirects();
    }
  }

  ngOnInit(): void { }

  onFilterChange() {
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
          : true; 
      return matchesStartDate && matchesEndDate && matchesStatus;
    });

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
        const tableData = res?.data?.table;
        if (tableData && tableData.length > 0) {
          this.directs = tableData;
          this.filteredDirects = [...this.directs];
          this.responseMessage = '';
          this.updatePagination();
        } else {
          
          this.directs = [];
          this.filteredDirects = [];
          this.responseMessage = res?.message;
        }
      })
      .catch((error) => {
        this.directs = [];
        this.filteredDirects = [];
        this.responseMessage = 'Error fetching data!';
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
