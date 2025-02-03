import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { EncryptionService } from '../encryption.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass, HomeComponent, CommonModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string = '';
  cartQuantity: number = 0; // To store the cart quantity
  mainCategory: any[] = [];
  subCategory: { [key: number]: any[] } = {};
  isSubCategoryVisible: { [key: number]: boolean } = {};
  isDropdownVisible: { [key: number]: boolean } = {}; // Dropdown visibility
  productByKeyword: any[] = [];
  searchTerm: string = ''; // To track search input
  myId = Date.now(); // Epoch time
  isSidebarOpen: boolean = false; // Sidebar state
  private searchSubject = new Subject<string>();
  private routerSubscription: Subscription;
  isHovered: { [key: number]: boolean } = {}; // To track hover state for categories
  isPopupVisible = false;
  isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private encryptionService: EncryptionService, // Inject EncryptionService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeSidebar(); // Close sidebar on navigation
      }
    });
  }

  ngOnInit(): void {
    this.getMainCategory();
    this.createanonUser();
    this.checkUserLoggedIn();
    this.updateCartQuantity();

    // Setup search subscription
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((keyword) =>
          this.userService.SearchProductByKeyword(keyword),
        ),
      )
      .subscribe((data) => {
        this.productByKeyword = data;
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe(); // Cleanup
  }

  checkUserLoggedIn(): void {
    const sessionUserId = sessionStorage.getItem('userId'); // General user login check
    const sessionUserType = sessionStorage.getItem('usertype'); // Add admin login check

    console.log(`User ID: ${sessionUserId}`); // Log the user ID
    console.log(`User Type: ${sessionUserType}`); // Log the user type

    if (sessionUserId) {
      this.isLoggedIn = true;
      this.userName = sessionUserId; // Set the userName from session storage
      console.log(`User is logged in: ${this.userName}`); // Log successful login
    } else {
      this.isLoggedIn = false;
      console.log('User is not logged in.'); // Log login failure
    }

    if (sessionUserType === 'Admin') {
      // If admin is logged in
      this.isAdmin = true;
      console.log('User is an Admin.'); // Log admin status
    } else {
      this.isAdmin = false;
      console.log('User is not an Admin.'); // Log non-admin status
    }
  }

  updateCartQuantity(): void {
    const sessionUserId = sessionStorage.getItem('memberId');
    const tempUserId = localStorage.getItem('TempUserId');

    if (sessionUserId) {
      this.isLoggedIn = true;
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Automatically update the cart quantity
      });
      this.userService.updateCartQuantity(Number(sessionUserId));
    } else if (tempUserId) {
      this.isLoggedIn = false;
      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity; // Update cart quantity for anonymous user
      });
      this.userService.updateCartQuantity(Number(tempUserId));
    }
  }

  createanonUser(): void {
    const uid = localStorage.getItem('TempUserId');
    if (!uid) {
      localStorage.setItem('TempUserId', this.myId.toString());
    }
  }

  togglePopup(): void {
    this.isPopupVisible = !this.isPopupVisible;
  }

  closePopup(): void {
    this.isPopupVisible = false;
  }

  signOut(): void {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }

  getMainCategory(): void {
    this.userService.getMainCategory().subscribe(
      (res: any[]) => {
        this.mainCategory = res;
      },
      (error) => {},
    );
    this.updateCartQuantity(); // Ensure cart quantity is updated after fetching categories
  }

  loadSubCategory(parentCategoryId: number): void {
    if (!this.subCategory[parentCategoryId]) {
      this.userService.getSubCategory(parentCategoryId).subscribe(
        (res: any[]) => {
          this.subCategory[parentCategoryId] = res;
          this.isSubCategoryVisible[parentCategoryId] = true; // Show subcategory after loading
        },
        (error) => {},
      );
    } else {
      // If already loaded, just toggle visibility
      this.isSubCategoryVisible[parentCategoryId] =
        !this.isSubCategoryVisible[parentCategoryId];
    }
  }

  toggleDropdown(subCategoryId: number): void {
    this.isDropdownVisible[subCategoryId] =
      !this.isDropdownVisible[subCategoryId];
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value; // Update search term
    if (this.searchTerm.length > 2) {
      this.searchSubject.next(this.searchTerm); // Push to subject
    } else {
      this.clearSearch();
    }
  }

  navigateToProduct(productId: number): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/product', productId]);
    });
    this.clearSearch();
  }

  onAddToCart(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/shopping-cart']);
    });
    this.updateCartQuantity(); // Update cart quantity after adding to cart
  }

  clearSearch(): void {
    this.searchTerm = ''; // Clear search term
    this.productByKeyword = []; // Clear the search results
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar visibility
  }

  toggleSubCategory(parentCategoryId: number): void {
    // Close all other subcategories
    for (const key in this.isSubCategoryVisible) {
      if (key != parentCategoryId.toString()) {
        this.isSubCategoryVisible[key] = false; // Close other submenus
      }
    }

    // Toggle the clicked submenu
    this.isSubCategoryVisible[parentCategoryId] =
      !this.isSubCategoryVisible[parentCategoryId];

    // Load subcategories if they haven't been loaded yet
    if (!this.subCategory[parentCategoryId]) {
      this.loadSubCategory(parentCategoryId);
    }
  }

  redirectToLogin(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']); // Redirect to login page
  }

  closeSidebar(): void {
    this.isSidebarOpen = false; // Close the sidebar
  }

  showSubCategory(categoryID: number) {
    this.isHovered[categoryID] = true;
  }

  hideSubCategory(categoryID: number) {
    this.isHovered[categoryID] = false;
  }

  trackByProductId(index: number, product: any): number {
    return product.productId;
  }

  trackByCategoryId(index: number, category: any): number {
    return category.categoryID;
  }

  trackBySubCategoryId(index: number, subCategory: any): number {
    return subCategory.categoryID;
  }
}
