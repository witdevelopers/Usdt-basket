import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/user/services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,MatIconModule, RouterLink, CommonModule],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isPaidRegistration: boolean = false;
  loading: boolean = false; // Loading state
  pannumber: string = ''; // Model for pannumber
  panAlreadyExists: boolean = false;
  form: FormGroup;
  isPasswordVisible: boolean = false;
  pinnumber: number | null = null; // Initialize as null
  pinpassword: string = '';
  isSubmitted: boolean = false;
  userid: any;
  isVisible:boolean=false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userservice: UserService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRegistrationSettings();
    this.loadPinData();
    this.getReferralId();
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  loadPinData() {
    const pinData = this.userservice.getPinData();

    if (pinData) {
      console.log('Received Pin Data R:', pinData.pinData);
      console.log('Received Pin Password R:', pinData.pinPassword);

      // Set the values to the component properties
      this.pinnumber = pinData.pinData;
      this.pinpassword = pinData.pinPassword;

      if (pinData) {
        this.signupForm.get('pinnumber')?.setValue(pinData.pinData);
        this.signupForm.get('pinpassword')?.setValue(pinData.pinPassword);
        this.validatePin();
      }
    } else {
      console.error('No data received from service.');
    }
  }

  CheckValidPan() {
    const pannumber = this.signupForm.get('pannumber')?.value; // Get the PAN number value
    console.log('PAN number input on blur:', pannumber); // Debug log

  //   if (pannumber) {
  //     this.userservice
  //       .getValidPan(pannumber)
  //       .then((res: any) => {
  //         if (res.status === true) {
  //           const panExists = res.data.table[0].success === 'True';

  //           console.log('Pan Exist', panExists);
  //           if (panExists) {
  //           } else {
  //             // Clear the PAN number field when the PAN card is invalid
  //             this.signupForm.get('pannumber')?.setValue('');
  //             // Show error alert for invalid PAN
  //             Swal.fire({
  //               icon: 'warning',
  //               title: 'Warning',
  //               text: 'PAN card is already exist. Please enter a valid PAN card.',
  //               confirmButtonText: 'OK',
  //             });
  //           }
  //         } else {
  //           // Handle unexpected status
  //           console.error('Unexpected response status:', res.message);
  //           Swal.fire({
  //             icon: 'warning',
  //             title: 'Warning',
  //             text: 'Unexpected response from the server. Please try again.',
  //             confirmButtonText: 'OK',
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error checking PAN:', error);
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'An error occurred while checking the PAN. Please try again later.',
  //           confirmButtonText: 'OK',
  //         });
  //       });
  //   } else {
  //     console.error('PAN number is not provided');
  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Warning',
  //       text: 'Please enter a PAN number.',
  //       confirmButtonText: 'OK',
  //     });
  //   }
   }

  private initializeForm() {
    this.signupForm = this.fb.group(
      {
        pinnumber: ['', Validators.required],
        pinpassword: [''],
        pintype: [''],
        ReferalId: ['', Validators.required],
        ReferalName: ['', Validators.required],
        //userId: ['', Validators.required],
        name: ['', Validators.required],
        
        mobile: ['', Validators.required ,Validators.minLength(10)],
        // pannumber: [''],
        // txtBankName: [''],
        // txtBranchName: [''],
       // email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  getReferralId() {
    console.log('Hello From URL');
    this.route.queryParams.subscribe((params) => {
      const referralId = params['referralId'];
      if (referralId) {
        this.signupForm.patchValue({ ReferalId: referralId });
        this.validateSponsor(referralId);
      }
    });
  }

  loadRegistrationSettings() {
    this.authService
      .getRegistrationSettings()
      .then((response: any) => {
        if (response.status === true) {
          const registrationSettings = response.data.table[0];
          this.isPaidRegistration = registrationSettings.isPaidRegistration;
          if (!this.isPaidRegistration) {
            this.signupForm.patchValue({
              pinnumber: '',
              pinpassword: '',
              pintype: '',
            });
          }
        }
      })
      .catch((error: any) => {
        console.error('Error loading registration settings:', error);
      });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // If confirmPassword is empty or passwords match, no error
    if (!confirmPassword || password === confirmPassword) {
      return null;
    }
  
    // Return an error object if passwords do not match
    return { mismatch: true };
  }

  private passwordStrengthValidator(control: any) {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const valid = hasUpperCase || hasLowerCase || hasNumeric;
    return valid ? null : { weakPassword: true };
  }

  validateSponsor(referralId: string) {
    if (referralId) {
      this.authService
        .isSponsorValid(referralId)
        .then((res: any) => {
          if (res.status === true) {
            this.signupForm.patchValue({ ReferalName: res.name });
          } else {
            // Clear both Referral ID and Referral Name on invalid referral ID
            this.signupForm.patchValue({
              ReferalId: '', // Clear the Referral ID
              ReferalName: '',
            });
            Swal.fire(res.message, '', 'error');
          }
        })
        .catch((error) => {
          console.error('Error validating sponsor:', error);
          this.signupForm.patchValue({
            ReferalId: '', // Clear the Referral ID
            ReferalName: '',
          });
          Swal.fire('Error validating Referral ID', '', 'error');
        });
    } else {
      this.signupForm.patchValue({
        ReferalId: '', // Clear Referral ID if input is empty
        ReferalName: '',
      });
    }
  }



  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required') && (control.dirty || control.touched)) {
      return `${controlName.replace(/([A-Z])/g, ' $1')} is required.`;
    }
    return '';
  }

  async validatePin() {
    const { pinnumber, pinpassword } = this.signupForm.value;
    if (pinnumber && pinpassword) {
      try {
        const pinPasswordNumber = parseInt(pinpassword, 10);
        const pinData = await this.authService.isValidPin(
          pinnumber,
          pinPasswordNumber
        );
        if (pinData) {
          this.signupForm.patchValue({ pintype: pinData.description });
        }
      } catch (error) {
        console.error('Error validating pin:', error);
        Swal.fire(error.message || 'Error validating pin', '', 'warning');
        this.signupForm.patchValue({ pintype: '' });
      }
    } else {
      this.signupForm.patchValue({ pintype: '' });
    }
  }

  async onSubmit() {
    this.isSubmitted = true; // Set form as submitted

    // Check if the required fields are filled
    const passwordMatchError = this.passwordMatchValidator(this.signupForm);
    if (passwordMatchError) {
      return; // Prevent API call if passwords do not match
    } 

    
    if (
      !this.signupForm.get('ReferalName')?.value ||
      //!this.signupForm.get('userId')?.value ||
      !this.signupForm.get('ReferalId')?.value ||
      !this.signupForm.get('name')?.value ||
      !this.signupForm.get('mobile')?.value ||
      //!this.signupForm.get('email')?.value ||
      !this.signupForm.get('password')?.value ||
      !this.signupForm.get('confirmPassword')?.value
    ) {
      return; // Prevent API call
    }

    console.log('Form submitted:', this.signupForm.value); // Log the form values
    this.loading = true;

    const {
      pinnumber,
      pinpassword,
      password,
      //userId, // Ensure the variable name matches the form control name
      name,
      mobile,
      //email,
      // pannumber,
      // txtBankName,
      // txtBranchName,
      ReferalId,
    } = this.signupForm.value;

    try {
      const res: any = await this.authService.registerMLM(
        pinnumber,
        pinpassword,
       // email,
       // userId, // Pass userId correctly
        mobile,
        // pannumber,
        // txtBankName,
        // txtBranchName,
        password,
        name,
        ReferalId
      );

      if (res.status === true) {
        Swal.fire({
          title: res.message,
          icon: 'success',
        });
        this.signupForm.reset(); // Reset form on success
        this.router.navigate(['/signin']);
      } else {
        Swal.fire(res.message, '', 'warning');
      }
    } finally {
      this.loading = false; // Stop loading
    }
  }
}
