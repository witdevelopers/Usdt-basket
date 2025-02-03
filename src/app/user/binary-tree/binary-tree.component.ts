import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-binary-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.css'],
})
export class BinaryTreeComponent implements OnInit {
  treeData: any[] = []; // Store the tree data here
  treeRoot: any = null; // Store the root node of the tree
  userId: string; // User ID from session
  sponsorUserID: string; // Sponsor User ID from session
  isLoading: boolean = true; // Loading state

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getUserIdsFromSession();
    this.fetchBinaryTreeData();
  }

  // Get User ID and Sponsor User ID from session storage or any other storage
  getUserIdsFromSession(): void {
    this.userId = sessionStorage.getItem('userId'); // Adjust key as necessary
    this.sponsorUserID = sessionStorage.getItem('userId'); // Adjust key as necessary
  }

  // Fetch data from API using service method
  fetchBinaryTreeData(): void {
    if (this.userId && this.sponsorUserID) {
      this.userService
        .binarytree(this.userId, this.sponsorUserID)
        .then((response: any) => {
          if (response.status && response.data && response.data.table) {
            this.treeData = response.data.table;
            this.treeRoot = this.buildTree('1'); // Start building the tree with root srno '1'
          }
        })
        .catch((error) => {
          console.error('Error fetching binary tree data:', error);
        })
        .finally(() => {
          this.isLoading = false; // Stop loading state
        });
    } else {
      console.error(
        'User ID or Sponsor User ID is not available in session storage.',
      );
      this.isLoading = false; // Stop loading state if IDs are not available
    }
  }

  // Recursively build the tree structure
  buildTree(memId: string): any {
    const member = this.treeData.find((item) => item.memId === memId);
    if (!member) return null;

    return {
      member: {
        lmid: member.lmid,
        rmid: member.rmid,
        srno: member.srno.toString(),
      },
      left:
        member.lmid && member.lmid !== '0' ? this.buildTree(member.lmid) : null,
      right:
        member.rmid && member.rmid !== '0' ? this.buildTree(member.rmid) : null,
    };
  }
}
