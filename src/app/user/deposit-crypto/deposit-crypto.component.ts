import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode'; // Import QRCodeModule
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-deposit-crypto',
  standalone: true,
  imports: [FormsModule, CommonModule, QRCodeModule], // Include QRCodeModule
  templateUrl: './deposit-crypto.component.html',
  styleUrls: ['./deposit-crypto.component.css'],
})
export class DepositCryptoComponent implements OnInit {
  cryptoOptions: any[] = []; // Array to store the cryptocurrency options
  selectedCrypto: any; // To store the selected cryptocurrency
  conversionRate: number; // To store conversion rate
  amount: number; // Amount entered by the user
  convertedAmount: number; // Converted amount
  qrCodeData: string; // Data for the QR code
  userDepositAddresses: any; // Object to store user's deposit addresses
  isQrCodeVisible: boolean = false; // To track QR code visibility

  // Updated base URL for images
  private baseUrl: string = 'https://hiicall.com/Mlm/Website/ProgramImages/';
  isSubmitted: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchSupportedCryptos(); // Fetch the supported cryptocurrencies when the component initializes
    this.fetchUserDetails(); // Fetch user details including deposit addresses
  }

  fetchSupportedCryptos(): void {
    this.userService.getSupportedCrypto().subscribe({
      next: (response) => {
        if (response.status) {
          this.cryptoOptions = this.processImageUrls(response.data.table); // Process image URLs

          // Automatically select the first crypto option after fetching
          if (this.cryptoOptions.length > 0) {
            this.selectCrypto(this.cryptoOptions[0]); // Select the first option by default
          }
        } else {
          console.error(response.message); // Handle error message
        }
      },
      error: (err) => {
        console.error('Error fetching supported cryptos', err); // Handle error
      },
    });
  }

  fetchUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        if (response.status) {
          this.userDepositAddresses = response.data[0]; // Assuming data is an array and we want the first item
        } else {
          console.error(response.message); // Handle error message
        }
      },
      error: (err) => {
        console.error('Error fetching user details', err); // Handle error
      },
    });
  }

  private processImageUrls(data: any[]): any[] {
    return data.map((crypto) => {
      // Process the imagePath by using the new base URL
      const processedImagePath = crypto.imagePath
        ? `${this.baseUrl}${crypto.imagePath.split('/').pop()}` // Concatenate base URL with the image file name
        : 'assets/default-image.jpg'; // Fallback to default image if imagePath is missing

      return {
        ...crypto,
        imagePath: processedImagePath, // Update imagePath with the processed URL
      };
    });
  }

  selectCrypto(crypto: any): void {
    this.selectedCrypto = crypto; // Set the selected cryptocurrency
    this.conversionRate = crypto.rate; // Get the conversion rate
    this.updateAddress(); // Update the amount based on the selected crypto
  }

  updateAddress(): void {
    let depositAddress = '';

    // Get the correct deposit address based on the selected crypto chain
    if (this.selectedCrypto.chain === 'BSC') {
      depositAddress = this.userDepositAddresses.depositBSCAddress;
    } else if (this.selectedCrypto.chain === 'MATIC') {
      depositAddress = this.userDepositAddresses.depositMATICAddress;
    }

    if (this.amount) {
      this.convertedAmount = this.amount * this.conversionRate; // Calculate the converted amount
      this.qrCodeData = depositAddress; // Store the deposit address in the QR code
    } else {
      this.convertedAmount = 0; // Reset if no amount is entered
      this.qrCodeData = ''; // Clear the QR code data if no amount is entered
    }
  }

  confirmDeposit(): void {
    this.isSubmitted = true; // Set submitted flag to show validation messages

    // Validate amount input
    if (!this.amount || isNaN(Number(this.amount))) {
      return; // Prevent further actions if the validation fails
    }

    let depositAddress = '';

    // Get the deposit address based on the selected cryptocurrency chain
    if (this.selectedCrypto.chain === 'BSC') {
      depositAddress = this.userDepositAddresses.depositBSCAddress;
    } else if (this.selectedCrypto.chain === 'MATIC') {
      depositAddress = this.userDepositAddresses.depositMATICAddress;
    }

    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we register the address.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Call the API to register the address to the listener before showing the QR code
    this.userService
      .registerAddressToListener(depositAddress, this.selectedCrypto.chain)
      .subscribe({
        next: (response) => {
          Swal.close();
          if (response.status) {
            this.isQrCodeVisible = true; // Show QR code on success
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to register deposit address. Please try again.',
              icon: 'error',
            });
          }
        },
        error: (err) => {
          Swal.close();
          console.error('Error registering address to listener', err);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred. Please try again later.',
            icon: 'error',
          });
        },
      });
  }

  copyAddress(): void {
    let depositAddress = '';
    if (this.selectedCrypto.chain === 'BSC') {
      depositAddress = this.userDepositAddresses.depositBSCAddress;
    } else if (this.selectedCrypto.chain === 'MATIC') {
      depositAddress = this.userDepositAddresses.depositMATICAddress;
    }

    if (depositAddress) {
      navigator.clipboard
        .writeText(depositAddress)
        .then(() => {
          Swal.fire({
            title: 'Copied!',
            text: 'Deposit address copied to clipboard!',
            icon: 'success',
            timer: 600, // Show for 100 milliseconds
            timerProgressBar: true, // Optional: show a progress bar
            showConfirmButton: false, // Hide the confirm button
          });
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
          Swal.fire({
            title: 'Error!',
            text: 'Could not copy deposit address.',
            icon: 'error',
            timer: 600, // Show for 100 milliseconds
            timerProgressBar: true, // Optional: show a progress bar
            showConfirmButton: false, // Hide the confirm button
          });
        });
    }
  }
}
