import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-for-investment-admin-side',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-for-investment-admin-side.component.html',
  styleUrls: ['./request-for-investment-admin-side.component.css'],
})
export class RequestForInvestmentAdminSideComponent implements OnInit {
  filterForm: FormGroup;
  investmentRequests: any[] = [];
  adminId: number; // Initialize this in the constructor
  noDataMessage: string = ''; // Variable to store the message

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Initialize the form group with userId, fromDate, toDate, and status fields
    this.filterForm = this.fb.group({
      userId: [''],
      fromDate: [''],
      toDate: [''],
      status: ['-1'],
    });

    // Fetch admin ID from session storage (assuming this is how you store it)
    this.adminId = parseInt(sessionStorage.getItem('adminId') || '0');
  }

  // Function to handle the form submission
  onFilterSubmit(): void {
    // Extract the form values
    const { userId, fromDate, toDate, status } = this.filterForm.value;

    // Pass the extracted values as parameters
    this.userService
      .getRequestsForInvestment(userId, fromDate, toDate, status)
      .subscribe(
        (response) => {
          // Check if response is successful and has data
          if (response?.status && response.data?.table) {
            this.investmentRequests = response.data.table;
            this.noDataMessage = ''; // Clear the message if data exists
          } else {
            // If no data, empty the investmentRequests array and set the noDataMessage
            this.investmentRequests = [];
            this.noDataMessage = response?.message || 'No data found!'; // Set API message or fallback message
          }
        },
        (error) => {
          console.error('Error fetching investment requests:', error);
          this.investmentRequests = [];
          this.noDataMessage = 'Error fetching data! Please try again later.'; // Set error message
        },
      );
  }

  approveRequest(request: any): void {
    const approveRejectDetails = {
      approveRejectRequestDetails: [
        {
          requestId: request.requestId,
          adminRemarks: 'Success', // Fixed admin remark
        },
      ],
      status: 1, // Assuming 1 indicates approved
      adminId: this.adminId, // Get adminId from session storage
    };

    this.userService.approveOrRejectRequest(approveRejectDetails).subscribe(
      (response) => {
        // Handle the successful response
        console.log('Request approved:', response);
        // Optionally, refresh the request list or update the UI
        this.onFilterSubmit();
      },
      (error) => {
        console.error('Error approving request:', error);
      },
    );
  }

  rejectRequest(request: any): void {
    const approveRejectDetails = {
      approveRejectRequestDetails: [
        {
          requestId: request.requestId,
          adminRemarks: 'Failure', // You can also set this as required
        },
      ],
      status: 2, // Assuming 2 indicates rejected
      adminId: this.adminId, // Get adminId from session storage
    };

    this.userService.approveOrRejectRequest(approveRejectDetails).subscribe(
      (response) => {
        // Handle the successful response
        console.log('Request rejected:', response);
        // Optionally, refresh the request list or update the UI
        this.onFilterSubmit();
      },
      (error) => {
        console.error('Error rejecting request:', error);
      },
    );
  }
}
