import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compose-tickets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './compose-tickets.component.html',
  styleUrls: ['./compose-tickets.component.css'],
})
export class ComposeTicketsComponent {
  toUserId: string = '';
  fromUserId: string = 'Admin'; // Defaulted to Admin
  Subject: string = '';
  Message: string = '';
  isVisible: boolean = false;
  isToAdmin: boolean = true; // Default value, will change based on userType
  isSubmitted: boolean = false;
  userType: string = '';

  constructor(private userService: UserService) {
    this.userType = sessionStorage.getItem('usertype');
    this.isVisible = this.userType === 'Admin';

    // Set isToAdmin based on userType
    if (this.userType === 'Admin') {
      this.isToAdmin = false; // Admin cannot send message to Admin
      this.toUserId = ''; // Admin won't have a recipient by default
    } else {
      this.isToAdmin = true; // User can send message to Admin
      this.toUserId = sessionStorage.getItem('userId') || ''; // Get the current user's ID
    }
  }

  SendMessage() {
    this.isSubmitted = true; // Mark form as submitted

    // Check if required fields are filled
    if (!this.toUserId || !this.Subject || !this.Message) {
      return; // Prevent sending message
    }

    console.log('Sending Message', {
      toUserId: this.toUserId,
      fromUserId: this.fromUserId,
      isToAdmin: this.isToAdmin,
      Subject: this.Subject,
      Message: this.Message,
    });

    // If all fields are filled, proceed to send the message
    this.userService
      .sendMessage(
        this.fromUserId, // Ensure 'fromUserId' comes first as per the service method
        this.toUserId, // Ensure 'toUserId' comes second as per the service method
        this.isToAdmin,
        this.Subject,
        this.Message,
      )
      .subscribe({
        next: (response) => {
          console.log('Message Sent', response);

          // Use Swal to show success message
          if (response.status) {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.message || 'Message Sent Successfully!',
              confirmButtonText: 'OK',
            });
            this.resetForm();
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'Warning',
              text: 'Message could not be sent. Please try again.',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while sending the message. Please try again.',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  resetForm() {
    this.Subject = '';
    this.Message = '';

    // If you also want to reset toUserId when it's visible
    if (this.isVisible) {
      this.toUserId = '';
    }
  }
}
