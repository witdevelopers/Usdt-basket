import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-transfer-pin-statistic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-pin-statistic.component.html',
  styleUrls: ['./transfer-pin-statistic.component.css'],
})
export class TransferPinStatisticComponent {
  isVisible: boolean = false;
  userIdInput: string = ''; // Initialize to avoid undefined
  pinDetails: any[] = []; // Ensure it's an array to avoid undefined errors
  usertype: string | null;
  fromDate: string = ''; // Use empty string instead of null
  toDate: string = ''; // Use empty string instead of null
  message: string = ''; // To store messages (success, no data, error)

  constructor(private api: UserService) {
    this.usertype = sessionStorage.getItem('usertype'); // Store usertype in a variable
    this.isVisible = this.usertype === 'Admin'; // Set visibility based on usertype
  }

  ViewTransferPinStatistic() {
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
      .getPinTransferStatistic(userID, this.fromDate, this.toDate)
      .then((res: any) => {
        console.log('Pin Transfer Statistic:', res);
        if (res.status === false && res.message) {
          // Set the message from the API if no data found
          this.message = res.message || 'No data found yet!';
          this.pinDetails = []; // Reset to empty
        } else if (res.status && res.data && res.data.table) {
          this.pinDetails = res.data.table; // Access the correct nested data
          this.message = ''; // Clear the message if data is found
        } else {
          this.pinDetails = []; // Reset to empty if no valid data
          this.message = 'No valid data found for the given criteria.'; // Set fallback message
        }
      })
      .catch((error) => {
        console.error('Error fetching pin transfer statistic:', error);
        this.message =
          'Error occurred while fetching data. Please try again later.'; // Fallback error message
      });
  }
}
