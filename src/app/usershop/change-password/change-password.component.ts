import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup; // Form group for handling form inputs
  userId: string | null = ''; // User ID from session storage
  isSubmitted = false;
  userType: string | null = null;
  isAdmin: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.userType = sessionStorage.getItem('usertype');
    this.isAdmin = this.userType?.toLowerCase() === 'admin';
  }

  ngOnInit() {
    // Initialize the form controls and validators
    this.changePasswordForm = this.fb.group({
      userId: ['', Validators.required], // Add User ID field
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
    this.userType = sessionStorage.getItem('usertype');
    this.userId = sessionStorage.getItem('userId');
    // Get userId from session storage
    if (this.userId) {
      this.changePasswordForm.patchValue({ userId: this.userId }); // Autofill User ID in the form
    } else {
      Swal.fire('Error', 'User not logged in', 'error');
      this.router.navigate(['/signin']); // Redirect to login if user is not found
    }
  }

  // Method to handle password change
  changePassword() {
    this.isSubmitted = true;

    // Validate the form
    if (this.changePasswordForm.invalid) {
      Swal.fire('Invalid Input', 'Please fill in all fields', 'error');
      return;
    }

    const { userId, newPassword, confirmNewPassword, oldPassword } =
      this.changePasswordForm.value;

    // Check if the new password and confirmation password match
    if (newPassword !== confirmNewPassword) {
      Swal.fire(
        'Password Mismatch',
        'New password and confirm password do not match',
        'error',
      );
      return;
    }

    // Create the payload for the password change request
    const payload = {
      userId, // Use the userId from form
      oldPassword,
      newPassword,
      userType: 1,
      isByAdmin: false,
      byAdminId: 0,
      isForgotPassword: false,
    };

    // Call the service to change the password
    this.userService.changePassword(payload).subscribe(
      (response) => {
        // Check if the password change was successful
        if (response.isSuccess) {
          // Show success message from SweetAlert
          Swal.fire('Success', 'Password changed successfully', 'success');
          this.changePasswordForm.reset(); // Reset the form after successful submission
        } else {
          // Show the message received from the API response
          Swal.fire('Error', response.message, 'error');
        }
      },
      (error) => {
        // Handle any errors that occur during the HTTP request
        Swal.fire(
          'Error',
          error.error.message || 'There was an error changing the password',
          'error',
        );
      },
    );
  }
}
