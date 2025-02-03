import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-total-income-daily',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './total-income-monthly.component.html',
  styleUrls: ['./total-income-monthly.component.css'],
})
export class TotalIncomeMonthlyComponent {
  userId: string = '';
  selectedPayoutNo: number | string = ''; // Holds selected payout number
  selectedType: number = -1; // Holds selected type (All, Carry Forward, Non-Carry Forward)
  selectedSlot: string = ''; // Displays the selected slot's text
  slots: { payoutNo: number; slot: string }[] = []; // Holds dropdown options
  incomeData: any[] = []; // Stores fetched income data
  paginatedData: any[] = []; // Data for current page
  errorMessage: string = ''; // Error message for UI
  isVisible: boolean = true; // Admin/User visibility toggle
  isReadOnly: boolean = false; // Controls if `userId` is editable
  isAdmin: boolean = false; // Indicates admin status
  filterAmount: number | null = null;

  // Pagination Properties
  pageNo: number = 1; // Current page number
  pageSize: number = 10; // Number of items per page
  pageCount: number = 0; // Total pages count
  hasNextPage: boolean = false; // Indicates if there's a next page

  constructor(private api: UserService) {}

  ngOnInit(): void {
    this.fetchSlots();

    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    this.isAdmin = userType === 'Admin';

    if (userType === 'User') {
      this.userId = sessionStorage.getItem('userId') || ''; // Automatically set userId for User
      this.isReadOnly = true; // Make userId readonly for User
    } else if (userType === 'Admin') {
      this.userId = ''; // Allow Admin to input userId
      this.isReadOnly = false;
    }
  }

  fetchSlots(): void {
    this.api.getTotalPayoutMonthly().subscribe(
      (response) => {
        if (response.status && response.data?.table) {
          this.slots = response.data.table.map((item: any) => ({
            payoutNo: item.payoutNo,
            slot: item.slot,
          }));
          if (this.slots.length > 0) {
            this.selectedPayoutNo = this.slots[0].payoutNo;
            this.selectedSlot = this.slots[0].slot;
          }
        }
      },
      (error) => {
        console.error('Error fetching slots:', error);
      },
    );
  }

  onSlotChange(): void {
    const selectedSlot = this.slots.find(
      (slot) => slot.payoutNo === Number(this.selectedPayoutNo),
    );
    this.selectedSlot = selectedSlot ? selectedSlot.slot : '';
    console.log('Selected Slot:', this.selectedSlot);
  }

  getTotalIncomeMonthly(): void {
    this.errorMessage = ''; // Reset error message

    // Prepare optional parameters based on provided input
    const payoutNo = this.selectedPayoutNo
      ? Number(this.selectedPayoutNo)
      : null;
    const selectedType = this.selectedType >= 0 ? this.selectedType : -1;
    const amountFilter = this.filterAmount || 0;
    const userIdFilter = this.userId || null;

    // API call with compulsory pageNo and pageSize, and optional filters
    this.api
      .getTotalIncomeMonthly(
        userIdFilter, // Pass null if userId is not provided
        payoutNo, // Pass null if payoutNo is not selected
        selectedType, // Pass null if type is not selected
        amountFilter, // Pass null if amount filter is not provided
        this.pageNo, // Compulsory parameter
        this.pageSize, // Compulsory parameter
      )
      .subscribe(
        (response) => {
          if (
            response.status &&
            response.data?.table &&
            response.data.table.length > 0
          ) {
            this.incomeData = response.data.table;
            this.updatePagination(); // Initialize pagination
          } else {
            this.incomeData = [];
            this.paginatedData = [];
            this.errorMessage =
              response.message || 'No data available for the given filters.';
            this.showPopup(this.errorMessage);
          }
        },
        (error) => {
          console.error('Error fetching income details:', error);
          this.errorMessage =
            'An error occurred while fetching income details.';
          this.showPopup(this.errorMessage);
        },
      );
  }

  // Pagination Logic
  updatePagination(): void {
    this.pageCount = Math.ceil(this.incomeData.length / this.pageSize);
    this.hasNextPage = this.pageNo < this.pageCount;
    this.paginatedData = this.incomeData.slice(
      (this.pageNo - 1) * this.pageSize,
      this.pageNo * this.pageSize,
    );
  }

  OnPreviousClick(): void {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.updatePagination();
    }
  }

  OnNextClick(): void {
    if (this.hasNextPage) {
      this.pageNo++;
      this.updatePagination();
    }
  }

  showPopup(message: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      text: '',
    });
  }

  onPayClick(userId: string, payoutNo: number, amount: number): void {
    if (!amount || amount <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'The amount to be paid must be greater than zero.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to pay ${amount} for User ID: ${userId}, Payout No: ${payoutNo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Pay',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.updatePayoutPaymentDaily(userId, payoutNo, amount).subscribe(
          (response) => {
            if (response.status) {
              Swal.fire({
                icon: 'success',
                title: 'Payment Successful',
                text:
                  response.message ||
                  'The payment has been successfully processed.',
              });
              this.getTotalIncomeMonthly(); // Refresh data after successful payment
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text:
                  response.message ||
                  'Failed to process the payment. Please try again.',
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                error.error?.message ||
                'An error occurred while processing the payment. Please try again.',
            });
            console.error('Payment API Error:', error);
          },
        );
      }
    });
  }
}
