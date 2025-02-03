import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-for-investment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-for-investment.component.html',
  styleUrls: ['./request-for-investment.component.css'],
})
export class RequestForInvestmentComponent {
  isSubmitted = false;
  investmentForm: FormGroup;
  investmentRequests: any[] = [];

  paymentModes = [
    'NEFT',
    'RTGS',
    'IMPS',
    'ATM DEPOSIT',
    'Cash Deposit',
    'Cheque',
  ];
  usertype: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.usertype = sessionStorage.getItem('usertype');
    this.investmentForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      paymentMode: ['', Validators.required],
      utrNumber: ['', Validators.required],
      remarks: [''],
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    // Prevent API call if the form is invalid
    if (this.investmentForm.invalid) {
      console.log('Form is invalid. API call prevented.');
      return;
    }

    // Otherwise, proceed with the API call
    console.log(
      'Form is valid. Proceeding with API call:',
      this.investmentForm.value,
    );

    const userId = sessionStorage.getItem('userId'); // Replace with actual user ID

    // Call the requestForInvestment method
    this.userService
      .requestForInvestment(
        userId,
        this.investmentForm.value.amount,
        this.investmentForm.value.paymentMode,
        this.investmentForm.value.utrNumber,
        this.investmentForm.value.remarks,
      )
      .subscribe(
        (response) => {
          if (response.data.table[0].success === 'False') {
            // Show error message using SweetAlert2
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.table[0].message,
            });
            console.log('Error:', response.message);
          } else {
            // Show success message using SweetAlert2
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: response.data.table[0].message, // Access the message from the response data
            });
            console.log('Success:', response.data.table[0].message);
          }
        },
        (error) => {
          // Show error message for API call failure
          Swal.fire({
            icon: 'error',
            title: 'API Call Failed',
            text: 'There was an issue with your request. Please try again later.',
          });
          console.log('API call failed', error);
        },
      );
  }

  getSubmitRequest() {
    const userId = sessionStorage.getItem('userId'); // example user ID
    this.userService.getSubmittedRequestForInvestment(userId).subscribe(
      (response) => {
        if (response && response.data && response.data.table) {
          this.investmentRequests = response.data.table; // Store table data in investmentRequests array
        }
        console.log('Investment Requests:', this.investmentRequests);
      },
      (error) => {
        console.error('Error fetching investment requests:', error);
      },
    );
  }
}
