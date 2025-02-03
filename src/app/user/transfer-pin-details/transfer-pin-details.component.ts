import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfer-pin-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-pin-details.component.html',
  styleUrls: ['./transfer-pin-details.component.css'],
})
export class TransferPinDetailsComponent {
  isVisible: boolean = false;
  userIdInput: string = ''; // Initialize to avoid undefined
  pinDetails: any[] = []; // Ensure it's an array to avoid undefined errors
  usertype: string | null;
  fromDate: string = ''; // Use empty string instead of null
  toDate: string = ''; // Use empty string instead of null
  noDataMessage: string = ''; // To store no data found message

  constructor(private api: UserService) {
    this.usertype = sessionStorage.getItem('usertype'); // Store usertype in a variable
    this.isVisible = this.usertype === 'Admin'; // Set visibility based on usertype
  }

  ViewTransferPinDetails() {
    let userID: string;
    const usertype = sessionStorage.getItem('usertype'); // Get usertype from session storage

    if (usertype === 'Admin') {
      userID = this.userIdInput; // Get userID from input field
    } else if (usertype === 'User') {
      userID = sessionStorage.getItem('userId') || ''; // Ensure 'userId' is stored in session storage
    } else {
      console.error('Invalid user type');
      return;
    }

    // Call the API with userID, fromDate, and toDate
    this.api
      .getPinTransferDetails(userID, this.fromDate, this.toDate)
      .then((res: any) => {
        console.log('Pin Transfer Details:', res);
        if (res.status === false && res.message === 'No data found!') {
          this.pinDetails = []; // Reset to empty if no valid data
          this.noDataMessage = res.message; // Set the no data message from the API response
        } else if (res.status && res.data && res.data.table) {
          this.pinDetails = res.data.table; // Access the correct nested data
          this.noDataMessage = ''; // Clear the message if data is found
        } else {
          this.pinDetails = []; // Reset to empty if no valid data
          console.warn('No valid data found in response.');
          this.noDataMessage =
            res.message || 'No data found for the given criteria.'; // Set the fallback no data message
        }
      })
      .catch((error) => {
        console.error('Error fetching pin transfer details:', error);
        this.noDataMessage =
          'Error occurred while fetching data. Please try again later.'; // Fallback error message
      });
  }
}
