import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-kyc',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-kyc.component.html',
  styleUrls: ['./update-kyc.component.css'],
})
export class UpdateKycComponent implements OnInit {
  pancardNo = '';
  panName = '';
  aadhaarNo = '';
  aadhaarName = '';
  userId = '';
  userType = '';
  kycData: any[] = [];
  noDataMessage: string = ''; // Will hold the message from the API

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userType = sessionStorage.getItem('usertype'); // Get userType from session storage

    if (this.userType === 'User') {
      this.userId = sessionStorage.getItem('userId'); // Get userId if user is logged in
      this.getKYCDetails(this.userId);
    }
  }

  submitKYC(): void {
    const userId =
      this.userType === 'Admin'
        ? this.userId
        : sessionStorage.getItem('userId');
    this.userService
      .insertKYC(
        userId,
        this.pancardNo,
        this.panName,
        this.aadhaarNo,
        this.aadhaarName,
      )
      .subscribe((response) => {
        if (response.status) {
          console.log('KYC submitted successfully!');

          // Show SweetAlert notification
          Swal.fire({
            title: 'Success!',
            text: 'KYC uploaded successfully!',
            icon: 'success',
            timer: 900,
            timerProgressBar: true,
            showConfirmButton: false,
          });

          // Call the API to get KYC details after successful upload
          this.getKYCDetails(userId);
        } else {
          console.log('KYC submission failed');

          // Show an error notification
          Swal.fire({
            title: 'Error!',
            text: 'KYC submission failed!',
            icon: 'error',
            timer: 900,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }
      });
  }

  // Method to get KYC details
  getKYCDetails(userId: string): void {
    this.userService.getKYC(userId).subscribe(
      (response) => {
        if (response.status && response?.data?.table?.length > 0) {
          this.kycData = response.data.table; // Populate the data
          this.noDataMessage = ''; // Clear the message when data is present
        } else {
          this.kycData = [];
          this.noDataMessage = response.message || 'No KYC data found!'; // Display the API message or default
        }
      },
      (error) => {
        console.error('Error fetching KYC details:', error);
        this.kycData = [];
        this.noDataMessage = 'Error fetching data. Please try again later.';
      },
    );
  }
}
