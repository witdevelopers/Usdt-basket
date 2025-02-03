import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { Settings } from 'src/app/app-setting';
import { EncryptionService } from '../encryption.service';
import { FormsModule } from '@angular/forms';
import { NgClass, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink, NgClass, SlicePipe],
})
export class SubcategoryComponent implements OnInit {
  subcategoryDetails: any[] = [];
  filteredSubcategoryDetails: any[] = [];
  subcategoryId: number;
  imageBaseUrl: string = Settings.imageBaseUrl;
  cartQuantity: number = 0;
  isLoggedIn: boolean = false;
  userName: string = '';
  searchTerm: string = '';
  productByKeyword: any[] = [];

  // Price filter properties
  minPrice: number = 0;
  maxPrice: number = 10000;
  categories: string[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home Appliances',
  ]; // Add more categories as needed
  selectedCategory: string = ''; // To hold the selected category

  // To keep track of products in cart
  productsInCart: Set<number> = new Set<number>();
  selectedSize: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subcategoryId = params['id'];
      this.loadSubcategoryData(this.subcategoryId);
    });

    const userId = sessionStorage.getItem('memberId');
    if (userId) {
      this.isLoggedIn = true;
      this.userName = sessionStorage.getItem('userId') || 'Profile';

      this.userService.cartQuantity$.subscribe((quantity) => {
        this.cartQuantity = quantity;
      });

      this.loadProductsInCart(Number(userId));
    }
  }

  loadSubcategoryData(id: number): void {
    this.userService.getAllProductByCategoryId(id).subscribe(
      (response) => {
        this.subcategoryDetails = response.table || [];
        console.log('Take this subcategory data: ', this.subcategoryDetails);
        this.subcategoryDetails = this.subcategoryDetails.map((product) => ({
          ...product,
          imageUrl: this.getImageUrl(product.imageUrl),
        }));
        this.filteredSubcategoryDetails = [...this.subcategoryDetails]; // Initialize with all products
      },
      (error) => {},
    );
  }

  getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}`
      : 'assets/default-image.jpg';
  }

  filterByPrice(): void {
    this.filteredSubcategoryDetails = this.subcategoryDetails.filter(
      (product) =>
        product.discountPrice >= this.minPrice &&
        product.discountPrice <= this.maxPrice,
    );
  }

  filterByCategory(): void {
    // If a category is selected, filter products by category
    if (this.selectedCategory) {
      this.filteredSubcategoryDetails = this.subcategoryDetails.filter(
        (product) => product.category === this.selectedCategory,
      );
    } else {
      this.filteredSubcategoryDetails = [...this.subcategoryDetails]; // Reset to all products if no category is selected
    }
  }

  applyFilters(): void {
    // Apply both price and category filters
    this.filterByPrice();
    this.filterByCategory();
  }

  loadProductsInCart(customerId: number): void {
    this.userService.getCart(customerId).subscribe(
      (response) => {
        this.productsInCart = new Set(
          response.items.map((item) => item.productId),
        );
      },
      (error) => {},
    );
  }

  addToCart(productDtId: number, sizeId: number, quantity: number): void {
    const customerId =
      sessionStorage.getItem('memberId') || localStorage.getItem('TempUserId');

    if (!customerId) {
      return;
    }

    this.userService
      .addToCart(+customerId, productDtId, sizeId, quantity)
      .subscribe(
        (response) => {
          this.loadProductsInCart(+customerId);
        },
        (error) => {
          // Handle the error if necessary
        },
      );
  }

  goToCart(): void {
    this.router.navigate(['/shopping-cart']);
  }

  getButtonText(productId: number): string {
    return this.productsInCart.has(productId) ? 'Go to Cart' : 'Add to Cart';
  }

  isProductInCart(productId: number): boolean {
    return this.productsInCart.has(productId);
  }
  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.selectedCategory = '';
    this.filteredSubcategoryDetails = [...this.subcategoryDetails]; // Reset to original product list
  }

  isFiltersOpen: boolean = false;
  // Method to toggle filter visibility

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen; // Toggle the state
  }
}
