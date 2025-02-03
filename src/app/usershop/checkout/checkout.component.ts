import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { Settings } from 'src/app/app-setting';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common'; // Import the Settings class

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [FormsModule, DecimalPipe, CommonModule],
})
export class CheckoutComponent implements OnInit {
  cartDetails: any = null;
  totalCartPrice = 0;
  totalDiscountPrice = 0;
  totalQuantity = 0;
  addresses: any[] = [];
  selectedAddress: any = null;
  newAddress = {
    customerId: 0,
    name: '',
    address1: '',
    address2: '',
    address3: '',
    postalCode: '',
    cityName: '',
    stateId: 0,
    countryId: 0,
    addressType: 0,
    phone: '',
    isActive: true,
    createdOn: new Date().toISOString(),
  };
  showAddressForm = false;
  isCartEmpty = true;
  isEditMode = false;
  countries: any[] = [];
  states: any[] = [];

  isAddressSelected = false;
  private imageBaseUrl: string = Settings.imageBaseUrl; // Dynamic base URL for images

  addressTypeMapping = {
    Home: 1,
    Office: 2,
    Other: 3,
  };

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getCartDetails();
    this.getCountries();
  }

  addAddress(): void {
    this.isEditMode = false;
    this.resetNewAddress();
    this.showAddressForm = true;
  }

  resetNewAddress(): void {
    this.newAddress = {
      customerId: 0,
      name: '',
      address1: '',
      address2: '',
      address3: '',
      postalCode: '',
      cityName: '',
      stateId: 0,
      countryId: 0,
      addressType: 0,
      phone: '',
      isActive: true,
      createdOn: new Date().toISOString(),
    };
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

  getCartDetails(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getCart(customerId).subscribe(
        (data) => {
          this.cartDetails = data;
          this.isCartEmpty =
            !this.cartDetails || this.cartDetails.items.length === 0;

          if (!this.isCartEmpty) {
            this.cartDetails.items.forEach((item: any) => {
              if (item.imageUrl && item.imageUrl.startsWith('~/')) {
                item.imageUrl = this.getImageUrl(item.imageUrl); // Dynamically construct image URL
              }
            });

            this.totalCartPrice = this.cartDetails.items.reduce(
              (sum: number, item: any) => sum + item.price * item.quantity,
              0,
            );
            this.totalDiscountPrice = this.cartDetails.items.reduce(
              (sum: number, item: any) =>
                sum + item.discountPrice * item.quantity,
              0,
            );
            this.totalQuantity = this.cartDetails.items.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0,
            );

            this.loadAddresses();
          }
        },
        (error) => {
          alert(
            'There was an error fetching cart details. Please try again later.',
          );
        },
      );
    } else {
      alert('Customer ID is missing. Please log in and try again.');
    }
  }

  loadAddresses(): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (customerId) {
      this.userService.getAddressesByCustomerId(customerId).subscribe(
        (data: any[]) => {
          this.addresses = data;
          this.isAddressSelected = false;
          this.showAddressForm = this.addresses.length === 0;
        },
        (error) => {},
      );
    } else {
    }
  }

  isFormInvalid(): boolean {
    return (
      !this.newAddress.name ||
      !this.newAddress.phone ||
      !this.newAddress.address1 ||
      !this.newAddress.postalCode ||
      !this.newAddress.cityName ||
      !this.newAddress.countryId ||
      !this.newAddress.stateId ||
      !this.newAddress.addressType
    );
  }

  createAddress(): void {
    if (this.isFormInvalid()) {
      alert('Please fill in all required fields.');
      return;
    }

    const customerId = +sessionStorage.getItem('memberId');
    this.newAddress.customerId = customerId;

    if (customerId) {
      this.userService.createAddress(this.newAddress).subscribe((response) => {
        this.loadAddresses();
        this.showAddressForm = false; // Hide form after creation
      });
    } else {
      alert('Please log in and try again.');
    }
  }

  editAddress(address: any): void {
    this.newAddress = { ...address };
    this.isEditMode = true;
    this.showAddressForm = true;
  }

  updateAddress(): void {
    const customerId = +sessionStorage.getItem('memberId');
    this.newAddress.customerId = customerId;

    if (customerId) {
      this.userService.updateAddress(this.newAddress).subscribe(
        (response) => {
          this.loadAddresses();
          this.resetNewAddress();
          this.isEditMode = false;
          this.showAddressForm = false;
        },
        (error) => {
          alert(
            'There was an error updating the address. Please try again later.',
          );
        },
      );
    } else {
      alert('Customer is missing. Please log in and try again.');
    }
  }

  deleteAddress(addressId: number): void {
    const customerId = +sessionStorage.getItem('memberId');
    if (confirm('Are you sure you want to delete this address?')) {
      this.userService.deleteAddress(customerId, addressId).subscribe(
        (response) => {
          this.loadAddresses();
        },
        (error) => {
          alert(
            'There was an error deleting the address. Please try again later.',
          );
        },
      );
    }
  }

  selectAddress(addressId: number): void {
    this.selectedAddress = addressId;
    this.isAddressSelected = true;
    this.userService.setSelectedAddressId(addressId);
  }

  checkout(): void {
    if (this.selectedAddress) {
      console.log(
        'Proceeding with checkout. Selected Address:',
        this.selectedAddress,
      );
      this.router.navigate(['/usershop/confirm']); // Adjust this path based on your routing setup
    } else {
      alert('Please select an address to proceed with checkout.');
    }
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

  // Method to construct the full image URL
  private getImageUrl(imagePath: string): string {
    return imagePath
      ? `${this.imageBaseUrl}${imagePath.replace('~/', '')}` // Construct full image URL using dynamic base URL
      : 'assets/default-image.jpg'; // Fallback image URL
  }
  goToProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]).catch((err) => {
      console.error('Navigation error:', err);
    });
  }
}
