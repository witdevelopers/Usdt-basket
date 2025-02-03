// update-usdt-address.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Adjust the path as necessary
import { catchError } from 'rxjs/operators'; // Import for error handling
import { of } from 'rxjs'; // Import for returning an observable of a fallback value
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-usdt-address',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-usdt-address.component.html',
  styleUrls: ['./update-usdt-address.component.css'], // Corrected styleUrl to styleUrls
})
export class UpdateUsdtAddressComponent implements OnInit {
  userId: string = null; // Variable for userId
  // Variable for USDT address
  ethAddress: string = ''; // Variable for ETH address
  btcAddress: string = ''; // Variable for BTC address
  userType = '';
  isVisible: boolean = true;
  bscAddress: string = null;
  maticAddress: string = '';
  trxAddress: string = null;
  isBSCAddressPresent: boolean = false;
  isTrcddressPresent: boolean = false;
  bindData: any[] = [];

  userIdErrorMessage: string = '';

  constructor(private userService: UserService) {
    this.userType = sessionStorage.getItem('usertype'); // Get userType from session storage

    if (this.userType === 'User') {
      this.userId = sessionStorage.getItem('userId'); // Get userId if user is logged in
      this.getUserDetails();
      this.isVisible = false;
    }
  }

  ngOnInit() {}

  getUserDetails(): void {
    this.userService.getUserDetails().subscribe((response) => {
      const bscAddress = response.data[0].withdrawalBSCAddress;
      const trxAddress = response.data[0].withdrawalTRXAddress;

      this.trxAddress = trxAddress;
      //this.isTrcddressPresent = !!this.trxAddress;
      this.bscAddress = bscAddress;
      this.isBSCAddressPresent = !!this.bscAddress;
      this.isTrcddressPresent = !!this.trxAddress;
    });
  }

  onSubmit() {
    this.updateAddresses();
  }

  updateAddresses() {
    // Check if userId is available
    if (!this.userId) {
      Swal.fire({
        title: 'Warning!',
        text: 'User ID is missing!',
        icon: 'warning',
        confirmButtonText: 'Okay',
      });
      return; // Exit if userId is not available
    }

    // Check if at least one address field is filled
    if (
      !this.maticAddress &&
      !this.ethAddress &&
      !this.btcAddress &&
      !this.bscAddress &&
      !this.trxAddress
    ) {
      Swal.fire({
        title: 'Warning!',
        text: 'At least one address field is required!',
        icon: 'warning',
        confirmButtonText: 'Okay',
      });
      return; // Exit if no address field is filled
    }

    // Proceed with the update if validation passes
    const addresses = {
      userId: this.userId,
      maticAddress: this.maticAddress,
      ethAddress: this.ethAddress,
      btcAddress: this.btcAddress,
      bscAddress: this.bscAddress,
      trxAddress: this.trxAddress,
    };

    this.userService
      .updateMultipleAddresses(addresses)
      .subscribe((response) => {
        // Check if response and data exist
        if (response && response.data && response.data.table.length > 0) {
          const result = response.data.table[0]; // Access the first item in the table array

          if (result.success === 'False') {
            // Show warning alert for invalid user
            Swal.fire({
              title: 'Invalid User!',
              text: result.message, // Extract the error message
              icon: 'warning',
              showConfirmButton: false, // Hide the confirm button
              timer: 900, // Display for 900 milliseconds
            });
          } else {
            // Show success alert
            this.getUserDetails();
            Swal.fire({
              title: 'Success!',
              text: result.message, // Extract the success message
              icon: 'success',
              showConfirmButton: false, // Hide the confirm button
              timer: 900, // Display for 900 milliseconds
            });
          }
        } else {
          // Handle case where response structure is not as expected
          Swal.fire({
            title: 'Error!',
            text: 'Unexpected response structure!',
            icon: 'error',
            confirmButtonText: 'Okay',
          });
        }
      });
  }
}
