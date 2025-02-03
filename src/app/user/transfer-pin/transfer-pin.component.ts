import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transfer-pin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer-pin.component.html',
  styleUrl: './transfer-pin.component.css',
})
export class TransferPinComponent {
  topUpPackages: any[] = [];
  selectedPackage: number | null = null;
  availablePinQuantity: number | null = null;
  fullName: string = '';
  userIdForTopup: string;
  toUserId: string;
  toUserName: string; // This will hold the fetched user's name

  noOfPinsToTransfer: number = 1; // Default value

  constructor(private userService: UserService) {
    this.getTopUpPackage();
  }

  onSubmit() {
    this.userService
      .transferPins(
        this.userIdForTopup,
        this.toUserId,
        this.selectedPackage,
        this.noOfPinsToTransfer,
      )
      .subscribe(
        (response) => {
          console.log('Pin transfer response:', response);

          if (response.status && response.data?.table?.length > 0) {
            const transferResult = response.data.table[0];

            // Check if the transfer was successful or not
            if (transferResult.success === 'True') {
              Swal.fire({
                title: 'Success!',
                text: `${transferResult.message}`,
                icon: 'success',
                confirmButtonText: 'OK',
              });
            } else {
              Swal.fire({
                title: 'Error!',
                text: `${transferResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
              });
            }
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Unexpected response structure!',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        },
        (error) => {
          console.error('Error transferring pins:', error);

          // Show error alert
          Swal.fire({
            title: 'Error!',
            text: `Error transferring pins: ${error.message || 'Something went wrong'}`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      );
  }

  getTopUpPackage() {
    this.userService.getTopUpPackage().subscribe(
      (response) => {
        console.log('Top Up Packages:', response);
        // Assuming response has a data.table property containing the packages
        this.topUpPackages = response.data?.table || [];
        // Set selectedPackage to the first package's srno
        this.selectedPackage =
          this.topUpPackages.length > 0 ? this.topUpPackages[0].srno : null;
        this.getAvailablePinQuantity(this.selectedPackage);
      },
      (error) => {
        console.error('Error fetching top-up packages:', error);
      },
    );
  }

  getAvailablePinQuantity(packId: number) {
    this.userService.getAvailablePinQuantity(packId).subscribe(
      (response) => {
        console.log('Available Pin Quantity:', response);
        // Access the correct path in the response to get noOfPinsAvailable
        this.availablePinQuantity =
          response.data?.table[0]?.noOfPinsAvailable || null; // Adjust to match your response structure
      },
      (error) => {
        console.error('Error fetching available pin quantity:', error);
      },
    );
  }

  onPackageChange() {
    if (this.selectedPackage) {
      this.getAvailablePinQuantity(this.selectedPackage); // Fetch quantity when package changes
    }
  }

  onUserIdChange(userId: string) {
    if (userId) {
      this.userService.getUserDetailsTop(userId).subscribe(
        (response) => {
          // Check if the response is valid and has data
          if (response.status && response.data.length > 0) {
            const user = response.data[0]; // Get the first user from the data array
            this.fullName = user.fullName; // Update fullName with the fetched user's full name
            // Optionally update other fields if needed
            // this.mainWalletBal = user.mainWalletBal; // Example: update main wallet balance
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

  onToUserIdChange(toUserId: string) {
    if (toUserId) {
      this.userService.getUserDetailsTop(toUserId).subscribe(
        (response) => {
          // Check if the response is valid and has data
          if (response.status && response.data.length > 0) {
            const user = response.data[0]; // Get the first user from the data array
            this.toUserName = user.fullName; // Update toUserName with the fetched user's full name
            // Optionally update other fields if needed
            // this.mainWalletBal = user.mainWalletBal; // Example: update main wallet balance
          } else {
            console.error(
              'User not found or invalid response',
              response.message,
            );
            this.toUserName = ''; // Reset toUserName if no valid user is found
          }
        },
        (error) => {
          console.error('Error fetching user details', error);
          this.toUserName = ''; // Reset toUserName if there's an error
        },
      );
    } else {
      this.toUserName = ''; // Reset toUserName if toUserId is empty
    }
  }
}
