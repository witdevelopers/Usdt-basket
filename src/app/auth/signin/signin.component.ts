import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2/dist/sweetalert2.all';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';  // Import ActivatedRoute
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/user/services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  standalone: true,
  imports: [FormsModule, MatIconModule, RouterLink, CommonModule]
})
export class SigninComponent implements OnInit {

  userID: string = '';
  password: string = '';
  isSignUp: boolean = false; // Flag to determine if the user is signing up
  userName: string;
  userService: any;
  cartQuantity: any;
  isLoggedIn: boolean = false;
  returnUrl: string = '/';  // Variable to capture the return URL (default to '/')
  wrong: boolean = false; // Flag to display the "Remember" message when login fails
  isPasswordVisible: boolean = false;

  constructor(
    private api: AuthService,
    private router: Router,
    private route: ActivatedRoute,  // Inject ActivatedRoute
    private spinnerService: NgxSpinnerService,
    private userservice: UserService
  ) {}

  ngOnInit(): void {
    // Capture the returnUrl from query parameters (if any)
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/usershop/affiliate';  // Default to '/home' if no returnUrl
    });
  }

  async onSubmit() {
    this.spinnerService.show();
  
    if (this.userID && this.password) {
      try {
        let res: any;
        if (this.isSignUp) {
          // Handle sign-up logic here if nee
          // res = await this.api.signUp(this.userID, this.password);
        } else {
          // Handle sign-in
          res = await this.api.loginMLM(this.userID, this.password);
          console.log(res, "login data");
        }
  
        if (res && res.status) {
          this.wrong = false; // Reset the wrong flag on successful login
          console.log(res, "login data");
  
          // Check if res.data and res.data.table exist before accessing their properties
          if (res.data && res.data.table && res.data.table[0]) {
            const userType = res.data.table[0].type;
  
            sessionStorage.setItem('userId', this.userID);
            sessionStorage.setItem('token', res.token);
  
            // Conditionally store adminId or memberId based on response
            if (res.data.table[0].adminId) {
              sessionStorage.setItem('adminId', res.data.table[0].adminId); // Store adminId if present
            } else if (res.data.table[0].memberId) {
              sessionStorage.setItem('memberId', res.data.table[0].memberId); // Store memberId if present
              sessionStorage.removeItem('adminId');
            }
  
            // Store userType only if it exists
            if (userType) {
              sessionStorage.setItem('usertype', userType); // No need for toString
            } else {
              console.warn('User type is undefined');
            }
  
            localStorage.setItem('userId', this.userID);
            localStorage.setItem('token', res.token);
  
            // Optionally update customer information
            const uid = sessionStorage.getItem('memberId') || sessionStorage.getItem('adminId'); // Use either adminId or memberId
            const Tuid = localStorage.getItem('TempUserId');
            if (Tuid && uid) {
              this.userservice.updateCustomer(Number(Tuid), Number(uid)).subscribe((res) => {
                // Optionally log the response from updating customer
              });
            }
  
            // Determine redirection based on user type
            this.spinnerService.hide();
            if (userType === 'Admin') {
              this.router.navigateByUrl('/usershop/affiliate').then(() => {
                window.location.reload(); // Force a full reload for Admin
              });
            } else if (userType === 'User') {
              this.router.navigateByUrl(this.returnUrl).then(() => {
                // Force a full reload after navigation
                window.location.reload();
              });
            } else {
              console.warn("Unknown user type:", userType);
              Swal.fire('Unknown user type. Please contact support.', '', 'error');
            }
          } else {
            this.spinnerService.hide();
            this.wrong = true; // Set the wrong flag to true if login fails
            console.error('Invalid response structure:', res); // Add a log to see the exact failed response
            Swal.fire('Login failed. Please try again.', '', 'error');
          }
  
        } else {
          this.spinnerService.hide();
          this.wrong = true; // Set the wrong flag to true if login fails
          console.log('Login failed:', res); // Add a log to see the exact failed response
          Swal.fire(res.message || 'Login failed. Please try again.', '', 'error');
        }
      } catch (error) {
        this.spinnerService.hide();
        this.wrong = true; // Set the wrong flag to true if login fails
        console.error('Login Error:', error); // Log the error for debugging
        Swal.fire('An error occurred. Please try again later.', '', 'error');
      }
    } else {
      this.spinnerService.hide();
      this.wrong = true; // Set the wrong flag to true if fields are not filled
      Swal.fire('Please fill in all fields.', '', 'warning');
    }
  }
  
  
  

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
