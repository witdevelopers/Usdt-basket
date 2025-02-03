import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Adjust the import path if necessary
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inbox-tickets',
  standalone: true,
  templateUrl: './inbox-tickets.component.html',
  styleUrls: ['./inbox-tickets.component.css'],
  imports: [CommonModule],
})
export class InboxTicketsComponent implements OnInit {
  messages: any[] = []; // Array to hold the inbox messages
  isVisible: boolean = false;
  filterUserId: string | null = null;

  constructor(private userService: UserService) {
    // Retrieve userType from sessionStorage to check if the user is an Admin
    const userType = sessionStorage.getItem('usertype');
    this.isVisible = userType === 'Admin'; // Set visibility based on userType
    this.filterUserId = this.isVisible
      ? null
      : sessionStorage.getItem('address'); // Filter by userId if not Admin
  }

  ngOnInit(): void {
    this.getInboxMessage();
  }

  getInboxMessage() {
    // Retrieve userId and userType from sessionStorage
    const userId = sessionStorage.getItem('address');
    const userType = sessionStorage.getItem('usertype');

    // Set isAdmin based on userType
    const isAdmin = userType === 'Admin'; // If userType is 'Admin', set isAdmin to true

    const isInbox = true; // Assuming you're fetching inbox messages

    if (userId) {
      this.userService.getInboxMessage(userId, isAdmin, isInbox).subscribe({
        next: (response) => {
          console.log('Inbox Messages:', response); // Log the full response
          if (response.status) {
            this.messages = response.data.table || []; // Access 'table' within 'data'
            console.log('Messages:', this.messages); // Log messages
          } else {
            console.warn('No messages found:', response.message);
            Swal.fire({
              // Show warning if no messages are found
              icon: 'warning',
              title: 'No Messages Found',
              text: response.message || 'There are no messages in your inbox.',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (error) => {
          console.error('Error fetching inbox messages:', error); // Log the error
          Swal.fire({
            // Show error message
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while fetching the inbox messages!',
            confirmButtonText: 'OK',
            timer: 2000, // Auto-close after 2 seconds
            timerProgressBar: true, // Show progress bar
          });
        },
      });
    } else {
      console.warn('No userId found in sessionStorage.');
      Swal.fire({
        // Alert if userId is missing
        icon: 'error',
        title: 'Error',
        text: 'User ID is missing in session storage!',
        confirmButtonText: 'OK',
      });
    }
  }

  deleteMessage(srno: number) {
    const isInbox = true; // Assuming you're deleting from inbox

    this.userService.deleteInboxCompanyMessage(srno, isInbox).subscribe(
      (response) => {
        console.log('Delete Response:', response); // Log the delete response
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
          });
          this.getInboxMessage(); // Refresh inbox after delete
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
        console.error('Error deleting message:', error); // Log the error
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
