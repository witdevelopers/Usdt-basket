import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';
import { AdminDashboardComponent } from '../color-dashboard/admin-dashboard.component';
import { ReferralDashboardComponent } from '../referral-dashboard/referral-dashboard.component';
import { AffiliateComponent } from '../../usershop/affiliate/affiliate.component';
import { DashboardComponent } from '../../user/dashboard/dashboard.component';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    CommonModule,
    MatMenuModule,
    AdminDashboardComponent,
    ReferralDashboardComponent,
    AffiliateComponent,
    DashboardComponent,
  ],
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent {
  isSidenavOpen: boolean = true;
  isBinary: boolean = false;
  isCryptoSystem: boolean = false;
  isTopUpSystem: boolean = false;
  isEpinSystem: boolean = false;
  isLevelCommission: boolean = false;
  isDirectCommission: boolean = false;
  isROICommission: boolean = false;
  isMatrixPlan: boolean = false;
  showComponents: boolean = true; // Flag to control visibility of components
  isVisible: boolean = false;
  userType: string | null = null; // Variable to store user type
  isLevelROICommission: boolean = false;

  constructor(private router: Router) {
    this.isBinary = sessionStorage.getItem('isBinary') === 'true';
    this.isLevelCommission =
      sessionStorage.getItem('isLevelCommission') === 'true';
    this.isDirectCommission =
      sessionStorage.getItem('isDirectCommission') === 'true';
    this.isROICommission = sessionStorage.getItem('isROICommission') === 'true';
    this.isLevelROICommission =
      sessionStorage.getItem('isLevelROICommission') === 'true';
    this.isMatrixPlan = sessionStorage.getItem('isMatrixPlan') === 'true';
    this.isCryptoSystem = sessionStorage.getItem('isCryptoSystem') === 'true';
    this.isTopUpSystem = sessionStorage.getItem('isTopUpSystem') === 'true';
    this.isEpinSystem = sessionStorage.getItem('isEpinSystem') === 'true';

    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
  }

  ngOnInit() {
    this.isSidenavOpen = true;
    this.userType = sessionStorage.getItem('usertype');
    // Get the userType from sessionStorage
    const userType = sessionStorage.getItem('usertype');

    // Check if userType is 'Admin'
    if (userType !== 'Admin') {
      // Redirect to another page if user is not an admin
      Swal.fire(
        'Access Denied',
        'You do not have access to this page.',
        'error',
      );
      this.router.navigateByUrl('/'); // Redirect to home or any other page
      return;
    }

    // If the user is an admin, continue showing the dashboard
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide all components when navigating away from the default route
        this.showComponents = this.router.url === '/'; // Show components only on the home route
      }
    });
  }

  toggleSidenav(sidenav: MatSidenav) {
    this.isSidenavOpen = !this.isSidenavOpen;
    if (this.isSidenavOpen) {
      sidenav.open();
    } else {
      sidenav.close();
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }

  closeSidenav(sidenav: MatSidenav) {
    sidenav.close();
    this.isSidenavOpen = false;
  }
}
