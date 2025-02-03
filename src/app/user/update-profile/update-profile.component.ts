import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'], // Corrected styleUrls here
})
export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmitted = false;
  userType: string | null = null; // Store user type
  isAdmin = false; // Flag to check if user is admin
  countries: any[] = [];
  states: any[] = [];
  countryId: any;
  stateId: any;
  userDepositAddresses: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Get user type from sessionStorage
    this.userType = sessionStorage.getItem('usertype');
    this.isAdmin = this.userType === 'Admin';
    this.getCountries();
    this.fetchUserDetails();
    // Initialize form
    this.profileForm = this.fb.group({
      txtUserId: [''], // Add this control for admin user to input userId
      txtFirstName: ['', Validators.required],
      txtAddress: ['', Validators.required],
      txtDistrict: ['', Validators.required],
      ddlState: ['', Validators.required],
      ddlCountry: ['', Validators.required],
      txtPinCode: ['', Validators.required],
      txtMobile: ['', [Validators.required]],
      txtEmail: ['', [Validators.required, Validators.email]],
      txtPanNo: ['', Validators.required],
    });

    // If user is not admin, set the userId from sessionStorage
    if (this.userType === 'User') {
      const userId = sessionStorage.getItem('userId');
      if (userId) {
        this.profileForm.patchValue({ txtUserId: userId });
      }
    }
  }

  // Submit the form
  onSubmit(): void {
    this.isSubmitted = true;

    if (this.profileForm.valid) {
      const userId = this.isAdmin
        ? this.profileForm.value.txtUserId
        : sessionStorage.getItem('userId')!;
      console.log('Submitting profile update for userId:', userId);

      this.userService
        .updateUserProfile(userId, this.profileForm.value)
        .subscribe({
          next: (response) => {
            console.log('Profile updated successfully!', response);
            Swal.fire({
              title: 'Success!',
              text: response.message,
              icon: 'success',
              timer: 900, // Duration in milliseconds
              timerProgressBar: true,
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: false,
            });
            this.fetchUserDetails();
          },
          error: (error) => {
            console.error('Error updating profile!', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue updating your profile. Please try again.',
              icon: 'error',
              confirmButtonText: 'Okay',
            });
          },
        });
    }
  }

  fetchUserDetails(): void {
    this.userService.getUserDetails().subscribe({
      next: (response) => {
        if (response.status) {
          this.userDepositAddresses = response.data[0]; // Assuming data is an array and we want the first item
          console.log("Fetched user's address:", this.userDepositAddresses);

          // Patch values to the form
          this.profileForm.patchValue({
            txtUserId: this.userDepositAddresses.userId,
            txtFirstName: this.userDepositAddresses.firstName,
            txtAddress: this.userDepositAddresses.address,
            txtDistrict: this.userDepositAddresses.district,
            txtCountryName: this.userDepositAddresses.countryName,
            txtStateName: this.userDepositAddresses.stateName,
            txtPinCode: this.userDepositAddresses.pincode,
            txtMobile: this.userDepositAddresses.mobileNo,
            txtEmail: this.userDepositAddresses.emailId,
            txtPanNo: this.userDepositAddresses.panCardNo,
          });
        } else {
          console.error(response.message); // Handle error message
        }
      },
      error: (err) => {
        console.error('Error fetching user details', err); // Handle error
      },
    });
  }

  getCountries(): void {
    this.userService.getCountries().subscribe(
      (countries: any[]) => {
        this.countries = countries;
      },
      (error) => {
        alert(
          'There was an error fetching the country list. Please try again later.',
        );
      },
    );
  }

  onCountryChange(countryId: number): void {
    if (countryId) {
      this.userService.getStatesByCountry(countryId).subscribe(
        (data) => {
          this.states = data;
        },
        (error) => {
          console.error('Error fetching states:', error);
        },
      );
    } else {
      this.states = [];
    }
  }
}
