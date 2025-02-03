import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'; // For form validation
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading: boolean = false; // Loading state
  message: string = '';
  error: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.loading = true; // Set loading to true

      this.userService.sendResetLink(email).subscribe(
        (response) => {
          this.loading = false; // Reset loading to false
          console.log('Reset password response', response);
          // Show success message with SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Password reset link sent successfully. Please check your email.',
            confirmButtonText: 'OK',
          });
        },
        (error) => {
          this.loading = false; // Reset loading to false
          // Show error message with SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was an issue sending the reset link. Please try again later.',
            confirmButtonText: 'OK',
          });
        },
      );
    } else {
      // Show validation error message with SweetAlert2
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please enter a valid email address.',
        confirmButtonText: 'OK',
      });
    }
  }
}
