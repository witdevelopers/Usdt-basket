import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service'; // Adjust the path if necessary
import { FormsModule } from '@angular/forms'; // For ngModel
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-pin',
  standalone: true,
  imports: [CommonModule, FormsModule], // Include FormsModule
  templateUrl: './view-pin.component.html',
  styleUrls: ['./view-pin.component.css'],
})
export class EPinComponent {
  isSubmitted: boolean = false;
  filterUserId: any;
  isPinsToUser: boolean = true; // Default to 'ToUser'
  isVisible: boolean = false; // Determines if the user is admin
  pinDetails: any[] = []; // Array to store pin details
  allotedType: string = ''; // For Alloted or Transferred dropdown
  pinNumber: string = ''; // For Pin Number input
  fromDate: string = ''; // For From Date input
  toDate: string = ''; // For To Date input
  status: string = ''; // For Status dropdown
  adminUserId: string = ''; // For admin inputted User ID
  noDataMessage: string = ''; // Message for no data
  userType: string = '';
  type: string = ''; // Default pin type (ToUser or ByUser)
  userId: string = '';
  allottedOrTransferred = ''; // Example value

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    this.userType = sessionStorage.getItem('usertype');
    this.isVisible = this.userType === 'Admin'; // Show input field if Admin
  }

  // Method to handle change in pin type (e.g., ToUser, ByUser)
  onPinTypeChange(selectedType: string) {
    this.isPinsToUser = selectedType === 'ToUser';
    this.type = selectedType; // Update the type for API call
  }

  deletePin(pinNumber: string, pinPassword: string) {
    const adminId = 1; // Replace with actual adminId if dynamic

    this.userService.deletePin(pinNumber, pinPassword, adminId).subscribe({
      next: (response) => {
        if (response.status) {
          Swal.fire({
            title: 'Success',
            text: response.message,
            icon: 'success',
            timer: 900,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message,
            icon: 'error',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while deleting the pin.',
          icon: 'error',
        });
        console.error('Error deleting pin:', error);
      },
    });
  }

  // Method to view details (triggered on button click or some event)
  viewDetails() {
    this.isSubmitted = true;

    this.getPinDetails(); // Fetch pin details with the current pin type

  }


  // Fetch pin details based on userId and type (ToUser/ByUser)
  getPinDetails() {
    const userType = sessionStorage.getItem('usertype');
    this.userId
    this.status
    this.fromDate
    this.toDate
    this.allottedOrTransferred
    this.type
    this.pinNumber

    if (userType === 'Admin') {
      // Admin can either leave it empty or manually provide the User ID
      // You can add validation or further checks here if necessary
      this.userId = this.adminUserId || ''; // This could be a model bound to the admin's input field
    } 
    // If the user type is 'User', fetch the user ID from sessionStorage
    else if (userType === 'User') {
      this.userId = sessionStorage.getItem('userId') || ''; // Automatically fetch userId from session storage
    }
  
    // Call the service with the required parameters
    this.userService.getPinDetails(
      this.userId, 
      this.status, 
      this.fromDate, 
      this.toDate, 
      this.allottedOrTransferred, 
      this.type, 
      this.pinNumber
    )
    .subscribe(
      (response: any) => {
        if (response.status && response.data && response.data.table) {
          this.pinDetails = response.data.table;
          this.noDataMessage = '';
        } else {
          this.pinDetails = [];
          this.noDataMessage = response.message ;
        }
      },
      (error) => {      }
    );
  }





  // Method to handle topup pin functionality
  topupPin(pin: any) {
    // Store pin data in the service
    this.userService.setPinData({
      pinData: pin.fullPinNo,
      pinPassword: pin.pinPassword,
    });

    // Navigate to the destination component
    this.router.navigate(['/user/topup-by-e-pin']);
  }

  // Method to handle pin registration
  registerPin(pin: any) {
    // Log the pin data to the console for debugging
    console.log('Registering Pin Data:', {
      pinData: pin.fullPinNo,
      pinPassword: pin.pinPassword,
    });

    // Set the pin data using the user service
    this.userService.setPinData({
      pinData: pin.fullPinNo,
      pinPassword: pin.pinPassword,
    });

    // Navigate to the destination component
    this.router.navigate(['/signup']);
  }
}
