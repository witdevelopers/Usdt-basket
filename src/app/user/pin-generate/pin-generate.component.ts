import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pin-generate',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pin-generate.component.html',
  styleUrls: ['./pin-generate.component.css'],
})
export class PinGenerateComponent implements OnInit {
  usertype: string | null = '';
  userId: string = '';
  byMemberOrAdminId: string = '';
  isByAdmin: boolean = true;
  noOfPins: string = '';
  remarks: string = '';
  packageId: string = '';
  PinValue: number;
  PinValuePaid: number;
  packages: any[] = [];
  apiResponse: any;
  isSubmitted: boolean = false;
  userIdErrorMessage: string | null = null;
  fullName: string = '';
  selectedPackage: any = null;
  Amount: any;
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getPackages();
    this.byMemberOrAdminId = sessionStorage.getItem('adminId');
  }

  getPackages(): void {
    this.userService.getPackages().subscribe(
      (response) => {
        if (response.status) {
          this.packages = response.data;
        }
      },
      (error) => {
        console.error('Error fetching packages:', error);
      },
    );
  }

  validateUserId(): void {
    this.userService.getUserDetails(this.userId).subscribe((response) => {
      if (
        response.status &&
        response.data &&
        response.data.length > 0 &&
        response.data[0].valid === 'True'
      ) {
        const user = response.data[0];
        this.fullName = user.fullName;
      } else {
        Swal.fire({
          icon: 'error',
          title: response.data[0].message,
        });
      }
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.isFormValid()) {
      if (!this.userIdErrorMessage) {
        this.generatePin();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Invalid User ID. Please enter a valid User ID.',
          icon: 'error',
        });
      }
    }
  }

  isFormValid(): boolean {
    return (
      this.userId.trim() !== '' &&
      this.packageId.trim() !== '' &&
      this.noOfPins.trim() !== '' &&
      this.Amount >= this.selectedPackage?.minRange && 
      this.Amount <= this.selectedPackage?.maxRange 
    );
  }

  generatePin(): void {
    this.userService
      .generatePin(
        this.userId,
        this.byMemberOrAdminId,
        this.isByAdmin,
        this.noOfPins,
        this.remarks,
        this.packageId,
        this.Amount, 
        this.Amount 
      )
      .subscribe(
        (response) => {
          this.apiResponse = response;
          Swal.fire({
            title: 'Success!',
            text: 'PIN generated successfully.',
            icon: 'success',
            timer: 900,
            timerProgressBar: true,
          });
          this.clearForm(); // Clear form fields after successful PIN generation
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Failed to generate PIN. Please try again.',
            icon: 'error',
          });
        }
      );
  }

  clearForm(): void {
    this.userId = '';
    this.packageId = '';
    this.noOfPins = '';
    this.remarks = '';
    this.Amount = undefined;
    this.isSubmitted = false;
    this.userIdErrorMessage = null;
  }

  onPackageChange() {
    this.selectedPackage = this.packages.find(pkg => pkg.srno === +this.packageId);

    if (this.selectedPackage) {
      this.Amount = this.selectedPackage.minRange; // Initialize Amount with minRange
      this.PinValue = this.Amount;
      this.PinValuePaid = this.Amount; // Ensure both values are set
    }
  }

  onAmountChange() {
    // Check if the Amount is within the valid range for the selected package
    if (this.Amount >= this.selectedPackage?.minRange && this.Amount <= this.selectedPackage?.maxRange) {
      this.errorMessage = ''; // Reset error message if valid
      this.PinValue = this.Amount; // Update PinValue
      this.PinValuePaid = this.Amount; // Update PinValuePaid
    } else {
      // Show error message if outside the valid range
      this.errorMessage = `Amount must be between ${this.selectedPackage?.minRange} and ${this.selectedPackage?.maxRange}.`;
    }
  }
}
