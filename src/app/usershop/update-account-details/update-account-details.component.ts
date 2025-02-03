import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/user/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-account-details',
  standalone: true,
  templateUrl: './update-account-details.component.html',
  styleUrls: ['./update-account-details.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class UpdateAccountDetailsComponent implements OnInit {
  bankForm: FormGroup;
  existingBankDetails: boolean = false;
  userId: string | null = '';
  userType: string | null = null;
  isAdmin: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.bankForm = this.fb.group({
      userId: ['', Validators.required],
      bankName: ['', Validators.required],
      branchName: ['', Validators.required],
      accountNo: ['', Validators.required],
      ifsCode: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      UPIId: ['', Validators.nullValidator],
      Gpay: ['', Validators.nullValidator],
      PhonePe: ['', Validators.nullValidator]
    });

    this.userType = sessionStorage.getItem('usertype');
    this.isAdmin = this.userType?.toLowerCase() === 'admin';
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.checkExistingBankDetails();
      this.userId = sessionStorage.getItem('userId');
      if (this.userId) {
        this.bankForm.patchValue({ userId: this.userId });
        this.bankForm.get('userId')?.disable();
      }
    }
    if (this.isAdmin) {
      this.userId = '';
      this.bankForm.patchValue({ userId: this.userId });
      this.bankForm.get('userId')?.enable();
      this.bankForm.get('userId')?.valueChanges.subscribe((userIdToFetch) => {
        if (userIdToFetch) {
          this.fetchUserDetailsForAdmin(userIdToFetch);
        }
      });
    }
  }

  checkExistingBankDetails() {
    this.userService.getUserDetails().subscribe(
      (response: any) => {
        if (response.status && response.data && response.data.length > 0) {
          const userDetails = response.data[0];
          if (
            userDetails.bankName &&
            userDetails.branchName &&
            userDetails.bankAccountNo &&
            userDetails.ifsCode
          ) {
            this.existingBankDetails = true;
            this.bankForm.patchValue({
              userId: userDetails.userId,
              bankName: userDetails.bankName,
              branchName: userDetails.branchName,
              accountNo: userDetails.bankAccountNo,
              ifsCode: userDetails.ifsCode,
              accountHolderName: userDetails.accountHolderName,
            });
            if (!this.isAdmin) {
              this.bankForm.disable();
            }
          }
        }
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
  }

  fetchUserDetailsForAdmin(userIdToFetch: string) {
    if (userIdToFetch) {
      this.userService.getUserDetails(userIdToFetch).subscribe(
        (response: any) => {
          if (response.status && response.data && response.data.length > 0) {
            const userDetails = response.data[0];
            this.bankForm.patchValue({
              bankName: userDetails.bankName,
              branchName: userDetails.branchName,
              accountNo: userDetails.bankAccountNo,
              ifsCode: userDetails.ifsCode,
              accountHolderName: userDetails.accountHolderName,
              upiId: userDetails.upiId,
              gpay: userDetails.gpay,
              phonePe: userDetails.phonePe,
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'No user details found for the provided userId.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            this.clearForm();
          }
        },
        (error) => {
          console.error('Error fetching user details', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while fetching user details.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }

  clearForm() {
    this.bankForm.reset();
  }

  onSubmit() {
    if (this.existingBankDetails) {
      Swal.fire({
        title: 'Error!',
        text: 'You already have bank details. You cannot update them.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (this.bankForm.valid) {
      const {
        userId,
        bankName,
        branchName,
        accountNo,
        ifsCode,
        accountHolderName,
        upiId,
        gpay,
        phonePe
      } = this.bankForm.value;

      this.userService
        .updateBankDetails(
          userId,
          bankName,
          branchName,
          accountNo,
          ifsCode,
          accountHolderName,
          upiId,
          gpay,
          phonePe
        )
        .then((response) => {
          const apiMessage = response.data?.table?.[0]?.message;

          Swal.fire({
            title: 'Success!',
            text: apiMessage,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        })
        .catch((error) => {
          const errorMessage = error.error?.message;

          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    }
  }

  isFormValid() {
    return this.bankForm.valid && !this.existingBankDetails;
  }
}
