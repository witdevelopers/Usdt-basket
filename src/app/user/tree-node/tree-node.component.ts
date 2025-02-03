import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

interface Member {
  lmid: string;
  rmid: string;
  srno: string;
  recLmid?: string;
  recRmid?: string;
}

interface TreeNode {
  member: Member;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeNodeComponent implements OnInit {
  @Input() node: TreeNode;

  showUserDetails: boolean = false;
  recLmidDetails: any[] = [];
  recRmidDetails: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.node) {
      this.fetchUserDetails(this.node.member);
    }
  }

  fetchUserDetails(member: Member) {
    const userId = sessionStorage.getItem('userId');
    const sponsorUserID = sessionStorage.getItem('userId');

    this.userService
      .binarytree(userId, sponsorUserID)
      .then((response) => {
        console.log('API Response:', response);
        if (response && response.data && Array.isArray(response.data.table)) {
          this.recLmidDetails = [];
          this.recRmidDetails = [];

          response.data.table.forEach((userDetail) => {
            // Check if the userDetail matches the left member ID
            if (userDetail.memId === member.lmid) {
              if (userDetail.recLmid) {
                const recLmidData = userDetail.recLmid.split(',');
                this.recLmidDetails.push({
                  ...this.createUserDetails(recLmidData),
                  srno: userDetail.srno, // Fetching srno directly from the API response
                });
              }
            }

            // Check if the userDetail matches the right member ID
            if (userDetail.memId === member.rmid) {
              if (userDetail.recRmid) {
                const recRmidData = userDetail.recRmid.split(',');
                this.recRmidDetails.push({
                  ...this.createUserDetails(recRmidData),
                  srno: userDetail.srno, // Fetching srno directly from the API response
                });
              }
            }
          });
        } else {
          console.warn('Invalid response structure:', response);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }

  private createUserDetails(dataArray: string[]): any {
    return {
      userId: dataArray[0] || 'No ID',
      userName: dataArray[1] || 'Unknown Name',
      selfBV: parseFloat(dataArray[10] || '0'),
      teamBV: parseFloat(dataArray[11] || '0'),
      status: dataArray[20] || 'Unknown',
      topDate: dataArray[6] || new Date().toLocaleString(),
    };
  }

  onAddUser(direction: 'left' | 'right'): void {
    this.router.navigate(['/auth/signup']);
  }

  toggleUserDetails(): void {
    this.showUserDetails = !this.showUserDetails;
  }
}
