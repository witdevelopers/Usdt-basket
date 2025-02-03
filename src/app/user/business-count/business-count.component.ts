import { Component, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business-count',
  standalone: true,
  templateUrl: './business-count.component.html',
  styleUrls: ['./business-count.component.css'],

  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Ensure ReactiveFormsModule is imported
})
export class BusinessCountComponent implements OnInit {
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
  isBinary: boolean;
  directDetailsForm: any;
  isSubmitted: boolean = false;

  constructor( private api: UserService, private fb: FormBuilder ) {
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    if (this.isAdmin) {
      this.filterUserId = '';
    } else {
      this.filterUserId = sessionStorage.getItem('address');
    }
    this.getBusinessCountDetails();
  }

  ngOnInit(): void {
    this.directDetailsForm = this.fb.group({
      filterUserId: [''], 
    });
  }

  getBusinessCountDetails() {
    this.isSubmitted = true;
    if (!this.filterUserId) {
      return;
    }

    this.api
      .getBusinessCountDetails(this.filterUserId)
      .subscribe((res: any) => {
       
        const tableData = res?.data?.table1;

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
      });
    console.log('erererere', this.filteredDirects);
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
