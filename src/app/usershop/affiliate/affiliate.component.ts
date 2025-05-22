import { Component, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from "../../user/dashboard/dashboard.component";
import { MatMenuModule } from '@angular/material/menu'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/auth/auth.service';
import { AdminDashboardComponent } from "../../admin/color-dashboard/admin-dashboard.component";
import { filter } from 'rxjs';
import { Settings } from 'src/app/app-setting';

declare var google: any;


@Component({
  selector: 'app-affiliate',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    DashboardComponent,
    MatMenuModule,
    AdminDashboardComponent,
    MatToolbarModule
  ],
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css'],
})

export class AffiliateComponent implements OnInit {
  isLoggedIn: boolean = false;
  isSidenavOpen: boolean = false;

  showComponents: boolean = true; // Flag to control visibility of components
  isSmallScreen: boolean = false; // Flag to track screen size
  userType: string = '';
  isAdmin: any;
  contractAddress: any;
  isBinary: boolean = false;
  isCryptoSystem: boolean = false;
  isTopUpSystem: boolean = false;
  isEpinSystem: boolean = false;
  isLevelCommission: boolean = false;
  isDirectCommission: boolean = false;
  isROICommission: boolean = false;
  isLevelROICommission: boolean = false;
  isMatrixPlan: boolean = false;
  userName: string = '';
  isGameEnabled: boolean = false;
address: any;
  // lastScrollTop: number = 0;
  // scrollDelta: number = -1;



  constructor(private router: Router, private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.isBinary = sessionStorage.getItem('isBinary') === 'true';
    this.isLevelCommission = sessionStorage.getItem('isLevelCommission') === 'true';
    this.isDirectCommission = sessionStorage.getItem('isDirectCommission') === 'true';
    this.isROICommission = sessionStorage.getItem('isROICommission') === 'true';
    this.isLevelROICommission = sessionStorage.getItem('isLevelROICommission') === 'true';
    this.isMatrixPlan = sessionStorage.getItem('isMatrixPlan') === 'true';
    this.isCryptoSystem = sessionStorage.getItem('isCryptoSystem') === 'true';
    this.isTopUpSystem = sessionStorage.getItem('isTopUpSystem') === 'true';
    this.isEpinSystem = sessionStorage.getItem('isEpinSystem') === 'true';
    this.isGameEnabled = sessionStorage.getItem('isGameEnabled') === 'true';
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    this.userType = sessionStorage.getItem('usertype');

    // Observe screen size changes
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isSmallScreen = result.matches; // Set true for small screens (handsets/tablets)
      });
  }

  ngOnInit(): void {
    //this.initBubbles();
    this.loadGoogleTranslate();
    this.updateScreenSize(window.innerWidth);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && this.isSmallScreen))
      .subscribe(() => this.closeSidenav());

    this.checkUserStatus();
    this.contractAddress = Settings.contractAddress;
  }

  loadGoogleTranslate() {
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      this.initializeTranslate();
    };
  }

  initializeTranslate(): void {
    new (window as any).google.translate.TranslateElement({
      pageLanguage: 'en',
     includedLanguages: 'de,en,fr,es,it,ru,ko,zh,ar,uz,kk,az,tr',
      layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL 
    }, 'google_translate_element');
  }
  
  toggleSidenav(sidenav: MatSidenav) {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.isSidenavOpen ? sidenav.open() : sidenav.close();
  }

  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateScreenSize(width);
  }

  updateScreenSize(width: number) {
    this.isSmallScreen = width < 768;
    this.isSidenavOpen = !this.isSmallScreen; // Open by default on large screens
  }

  checkUserStatus() {
    const sessionUserId = sessionStorage.getItem('address');
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    this.isLoggedIn = !!sessionUserId;
    this.userName = sessionUserId || '';
    this.isAdmin = isAdmin;
  }


  closeSidenav() {
    this.isSidenavOpen = false;
  }

  onNavItemClick(sidenav: MatSidenav) {
    if (this.isSmallScreen) {
      this.closeSidenav();
      sidenav.close();
    }
  }

  checkUserLoggedIn(): void {
    const sessionUserId = sessionStorage.getItem('address') || '';
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    this.isLoggedIn = !!sessionUserId;
    this.userName = sessionUserId;
    this.isAdmin = isAdmin;
  }

  signOut(): void {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.userName = '';
    this.router.navigate(['auth/login']);
    this.checkUserLoggedIn();
  }
  
  ContrectAddress(): void {
    window.location.href = `https://bscscan.com/address/${this.contractAddress}`;
  }
}
