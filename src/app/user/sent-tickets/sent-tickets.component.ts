import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Make sure to adjust the import path as necessary
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sent-tickets',
  templateUrl: './sent-tickets.component.html',
  styleUrls: ['./sent-tickets.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SentTicketsComponent {
  messages: any[] = []; // Array to hold the inbox messages
  isVisible: boolean = false;
  filterUserId: string;

  constructor(private userService: UserService) {
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin';
    this.filterUserId =
      userType === 'Admin' ? null : sessionStorage.getItem('userId');
  }

  ngOnInit(): void {
    this.getInboxMessage();
  }

  getInboxMessage() {
    const userType = sessionStorage.getItem('usertype');
    const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage
    const isAdmin = userType === 'Admin';
    const isInbox = false;

    if (userId) {
      this.userService.getOutboxMessage(userId, isAdmin, isInbox).subscribe({
        next: (response) => {
          console.log('Inbox Messages:', response);
          if (response.status) {
            this.messages = response.data.table || []; // Access the 'table' field within 'data'
          } else {
            console.warn('No messages found:', response.message);
          }
        },
        error: (error) => {
          console.error('Error fetching inbox messages:', error);
        },
      });
    } else {
      console.warn('No userId found in sessionStorage.');
      // Handle the case when userId is not found
    }
  }

  deleteMessage(srno: number) {
    this.userService.deleteOutboxCompanyMessage(srno, false).subscribe(
      (response) => {
        if (response.status) {
          this.messages = this.messages.filter(
            (message) => message.srno !== srno,
          ); // Remove deleted message from array
          Swal.fire({
            // Show success message using SweetAlert
            icon: 'success',
            title: 'Success',
            text: response.message, // Show the response message
            confirmButtonText: 'OK',
            timer: 2000, // Auto-close after 3 seconds
            timerProgressBar: true, // Show progress bar
            willClose: () => {
              // Optional: Perform any additional actions before closing
            },
          });
          this.getInboxMessage();
        } else {
          Swal.fire({
            // Show failure message using SweetAlert
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete message!',
            confirmButtonText: 'OK',
            timer: 2000, // Auto-close after 3 seconds
            timerProgressBar: true, // Show progress bar
          });
        }
      },
      (error) => {
        console.error('Error deleting message:', error); // Log error to console
        Swal.fire({
          // Show error message using SweetAlert
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while deleting the message!',
          confirmButtonText: 'OK',
          timer: 2000, // Auto-close after 3 seconds
          timerProgressBar: true, // Show progress bar
        });
      },
    );
  }
}
