import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-profile',
  templateUrl: './shopping-profile.component.html',
  styleUrls: ['./shopping-profile.component.css'],
  standalone: true,
  imports: [CurrencyPipe],
})
export class ShoppingProfileComponent implements OnInit {
  activeSection = 'profile-info'; // Default active section
  walletBalance: number = 0; // Initialize wallet balance
  cardAdded: string = ''; // Example card number; replace with actual data
  upiId: string = ''; // Example UPI ID; replace with actual data
  userDetails: any = {};
  addresses: any[] = []; // Array to hold user addresses

  constructor(
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Fetch wallet balance and payment methods here
    this.loadAccountDetails();
    this.getUserDetails();
    this.loadUserAddresses(); // Call to fetch user addresses
  }

  showSection(sectionId: string) {
    this.activeSection = sectionId; // Set the active section
  }

  getUserDetails(): void {
    this.userService.getUserDetails().subscribe(
      (data) => {
        this.userDetails = data; // Store user details in the component property
        console.log('UserData of user', this.userDetails);
        this.cdr.detectChanges(); // Manually trigger change detection if needed
      },
      (error) => {
        console.error('Error fetching user details:', error);
      },
    );
  }

  loadAccountDetails() {
    const walletId = 1; // Replace with the actual wallet ID if available
    const userId = sessionStorage.getItem('userId');
    this.userService.getWalletBalance(walletId, userId).subscribe({
      next: (response) => {
        // Adjusted to handle the full response
        console.log('Fetched wallet response:', response); // Debugging line
        this.walletBalance = response.balance; // Set the balance to walletBalance
        this.cdr.detectChanges(); // Trigger change detection manually if needed
      },
      error: (err) => {
        console.error('Error fetching wallet balance', err); // Handle errors
      },
    });

    // Fetch card details and UPI ID, you can replace with real fetch logic
    this.cardAdded = ''; // Replace with fetched card number
    this.upiId = ''; // Replace with fetched UPI ID
  }

  loadUserAddresses() {
    const customerId = Number(sessionStorage.getItem('memberId'));
    // Assuming the user ID is stored in userDetails

    this.userService.getAddressesByCustomerId(customerId).subscribe(
      (response) => {
        this.addresses = response; // Assuming the addresses are in the response.data
        console.log('Fetched user addresses:', this.addresses);
        this.cdr.detectChanges(); // Trigger change detection manually if needed
      },
      (error) => {
        console.error('Error fetching user addresses:', error);
      },
    );
  }

  signOut() {
    this.userService
      .signOut()
      .then(() => {
        this.router.navigate(['/login']).then(() => {
          window.location.href = '/home'; // Refresh to home page
        });
      })
      .catch((error) => {
        console.error('Sign out failed', error);
      });
  }
}
