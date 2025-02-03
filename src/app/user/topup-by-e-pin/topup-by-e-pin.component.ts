import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topup-by-e-pin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topup-by-e-pin.component.html',
  styleUrls: ['./topup-by-e-pin.component.css'],
})
export class TopupByEPinComponent implements OnInit {
  userIdForTopup: string = '';
  userName: string = '';
  fullName: string = ''; // Fetch this based on user ID
  pinnumber: number | null = null; // Initialize as null
  pinPassword: string = '';
  userId: any;
  isSubmitted: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const pinData = this.userService.getPinData();

    if (pinData) {
      console.log('Received Pin Data:', pinData.pinData);
      console.log('Received Pin Password:', pinData.pinPassword);

      // Set the values to the component properties
      this.pinnumber = pinData.pinData;
      this.pinPassword = pinData.pinPassword;
    } else {
      console.error('No data received from service.');
    }
  }

  onUserIdChange(event: FocusEvent) {
    const input = event.target as HTMLInputElement; // Typecast event target to HTMLInputElement
    const userId = input.value; // Get the value from the input

    if (userId) {
      this.userService.getUserDetailsTop(userId).subscribe(
        (response) => {
          console.log('Response:', response); // Log the response
          if (
            response.status &&
            response.data &&
            response.data.length > 0 &&
            response.data[0].valid === 'True'
          ) {
            const user = response.data[0];
            this.fullName = user.fullName; // Update with user's full name
          } else if (
            response.data &&
            response.data.length > 0 &&
            response.data[0].valid === 'False'
          ) {
            Swal.fire({
              icon: 'error',
              title: 'User ID Not Found',
              text: response.data[0].message,
            });
            this.fullName = ''; // Reset fullName if no valid user is found
          } else {
            console.error(
              'User not found or invalid response',
              response.message,
            );
            this.fullName = ''; // Reset fullName if no valid user is found
          }
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.fullName = ''; // Reset fullName if there's an error
        },
      );
    } else {
      this.fullName = ''; // Reset fullName if userId is empty
    }
  }

  clearData() {
    this.userIdForTopup = ''; // Reset the userIdForTopup field
    this.userName = '';
    //this.amount = 0;  // Reset the amount field
    this.getUserDetails();
  }

  getUserDetails() {
    this.userService.getUserDetails().subscribe(
      (response) => {
        console.log('User data:', response);

        const userData = response.data[0]; // Assuming the first item is relevant
        this.userId = userData.userId;
        this.fullName = userData.fullName;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      },
    );
  }

  onSubmit(form: NgForm) {
    this.isSubmitted = true;
    if (!this.userIdForTopup) {
      // Add any additional logic if needed
      return;
    }
    console.log('Form Submitted!', form.value);

    // Extracting values from the form
    const userId = form.value.userIdForTopup;
    const ByMemberId = Number(sessionStorage.getItem('memberId'));
    const PinNumber = form.value.pinnumber; // Get the selected package ID from form
    const PinPassword = form.value.pinPassword;

    const ByUserType = 2;

    // Call the topUp method from UserService
    this.userService
      .topupByEpin(userId, PinNumber, PinPassword, ByMemberId, ByUserType)
      .subscribe(
        (response) => {
          // Check if the response indicates a failure
          if (
            response.data &&
            response.data.table &&
            response.data.table.length > 0
          ) {
            const tableResponse = response.data.table[0]; // Get the first object in the table array

            // Check if success is false and display the message from the response
            if (tableResponse.success === 'False') {
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: tableResponse.message, // Show the message from the response
                confirmButtonText: 'OK',
              });
            } else {
              // Show success message if there's no error
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Topup successful.',
                confirmButtonText: 'OK',
              });
              form.resetForm();
              //this.clearData();
              this.ngOnInit();
            }
          } else {
            // Handle unexpected response format
          }

          // Optionally reset the form or update UI
        },
        (error) => {
          console.error('Error during topup', error);

          // Show error message for HTTP errors
        },
      );
  }
}
