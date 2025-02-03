import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-total-income-daily',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './total-income-daily.component.html',
  styleUrls: ['./total-income-daily.component.css'],
})
export class TotalIncomeDailyComponent {
  userId: string = '';
  selectedPayoutNo: number | string = ''; // This will hold the selected payoutNo
  selectedSlot: string = ''; // This will hold the selected slot's text
  slots: { payoutNo: number; slot: string }[] = []; // Holds the dropdown options
  incomeData: any[] = [];
  paginatedData: any[] = []; // Holds paginated data for display
  errorMessage: string = '';
  isVisible: boolean = true;
  isReadOnly: boolean = false; // Controls whether the userId field is readonly
  isAdmin: boolean = false;

  // Pagination Properties
  pageNo: number = 1; // Current page number
  pageSize: number = 5; // Items per page
  pageCount: number = 0; // Total number of pages
  hasNextPage: boolean = false;

  constructor(private api: UserService) {}

  ngOnInit(): void {
    this.fetchSlots();

    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    this.isAdmin = userType === 'Admin';

    if (userType === 'User') {
      this.userId = sessionStorage.getItem('userId') || ''; // Automatically set userId from session
      this.isReadOnly = true; // Make userId field readonly for users
      // this.isVisible = false;
    } else if (userType === 'Admin') {
      this.userId = ''; // Allow Admin to enter userId
      this.isReadOnly = false;
      // this.isVisible = true;
    }
  }

  fetchSlots(): void {
    this.api.getTotalPayoutDaily().subscribe(
      (response) => {
        if (response.status && response.data?.table) {
          // Set the slots array
          this.slots = response.data.table.map((item: any) => ({
            payoutNo: item.payoutNo,
            slot: item.slot,
          }));

          // Set default selectedPayoutNo if slots are available
          if (this.slots.length > 0) {
            this.selectedPayoutNo = this.slots[0].payoutNo; // Default to the first payoutNo
            this.selectedSlot = this.slots[0].slot; // Display the corresponding slot text
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

    if (selectedSlot) {
      this.selectedSlot = selectedSlot.slot; // Update the selected slot text
    } else {
      this.selectedSlot = ''; // Clear the selectedSlot if no match is found
    }

    console.log('Selected Slot:', this.selectedSlot); // Log to check the value
  }

  getTotalIncomeDaily(): void {
    this.errorMessage = ''; // Reset error message
    if (this.selectedPayoutNo) {
      this.api
        .getTotalIncomeDaily(this.userId, Number(this.selectedPayoutNo))
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
              this.errorMessage = response.message;
              this.showPopup(this.errorMessage);
            }
          },
          (error) => {
            console.error('Error fetching income details:', error);
          },
        );
    } else {
      console.log('Please select a valid slot');
    }
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
              this.getTotalIncomeDaily(); // Refresh data after successful payment
            } else {
              // Show error message from API if the status is false
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
            // Show detailed error message from the API response
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

  OnPageNoChange(): void {
    if (this.pageNo >= 1 && this.pageNo <= this.pageCount) {
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
}
