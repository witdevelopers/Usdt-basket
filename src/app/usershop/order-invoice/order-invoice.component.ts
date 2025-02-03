import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
// Adjust path based on your folder structure

@Component({
  selector: 'app-order-invoice',
  templateUrl: './order-invoice.component.html',
  styleUrls: ['./order-invoice.component.css'],
  standalone: true,
  imports: [DatePipe],
})
export class OrderInvoiceComponent implements OnInit {
  invoiceData: any; // To store the invoice data retrieved from API
  isLoggedIn: boolean;
  cartQuantity: number;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchInvoice();
    this.updateCartQuantity();
  }

  // Fetch the invoice data based on orderId from session storage
  fetchInvoice(): void {
    this.userService.getInvoiceByOrderNo().subscribe(
      (response) => {
        this.invoiceData = response;
      },
      (error) => {},
    );
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

  downloadInvoicePDF() {
    const DATA = document.getElementById('invoice-content')!;
    html2canvas(DATA).then((canvas) => {
      const fileWidth = 210;
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILE_URI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(FILE_URI, 'PNG', 0, 0, fileWidth, fileHeight);
      PDF.save('invoice.pdf');
    });
  }
  goToHomePage() {
    this.router.navigate(['/home']);
  }
}
