import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/user/services/user.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any;
  orderId: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    // Fetch the orderId from the URL
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    console.log('Ye le order No:', this.orderId);

    if (this.orderId) {
      this.getOrderDetails(this.orderId);
    } else {
      this.errorMessage = 'Invalid order number.';
    }
  }

  getOrderDetails(orderId: string) {
    // Call the service to fetch order details
    this.userService.getOrderdetailsByOrderid(orderId).subscribe(
      (data) => {
        this.orderDetails = data;
        console.log('Ye hai order details wala data', this.orderDetails);
        console.log('Fetched order details', data);
      },
      (error) => {
        this.errorMessage =
          'Failed to load order details. Please try again later.';
      },
    );
  }
}
