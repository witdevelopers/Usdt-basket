import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { UserService } from '../services/user.service';

interface Member {
  userID: string;
  memId: string;
  lmid: string;
  rmid: string;
  srno: string;
  recLmid?: string;
  recRmid?: string;
  rowt?: number; // optional root indicator
}

interface TreeNode {
  member: Member;
  left?: TreeNode | null;
  right?: TreeNode | null;
  memIdDetails?: string;
}

@Component({
  selector: 'app-binary-tree',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.css'],
})
export class BinaryTreeComponent implements OnInit {
  treeData: Member[] = [];
  treeRoot: TreeNode | null = null;
  userId: string = '';
  isLoading: boolean = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserIdFromSession();
    this.fetchBinaryTreeData();
  }

  getUserIdFromSession(): void {
    this.userId = sessionStorage.getItem('address') || '';
  }

  fetchBinaryTreeData(): void {
    if (!this.userId) {
      console.error('User ID is missing from session.');
      this.isLoading = false;
      return;
    }

    this.userService.getPoolTree(this.userId).subscribe({
      next: (response: any) => {
        if (response.status && response.data?.table?.length > 0) {
          this.treeData = response.data.table;
          const rootMember = this.treeData.find(m => m.rowt === 1);
          if (rootMember) {
            this.treeRoot = this.buildTree(rootMember.memId);
          } else {
            console.warn('Root node not found in the tree data.');
          }
        } else {
          console.warn('No valid tree data returned.');
        }
      },
      error: (error) => {
        console.error('Error fetching binary tree data:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  buildTree(memId: string): TreeNode | null {
    const member = this.treeData.find(m => m.memId === memId);
    if (!member) return null;

    return {
      member,
      left: member.lmid && member.lmid !== '0' ? this.buildTree(member.lmid) : null,
      right: member.rmid && member.rmid !== '0' ? this.buildTree(member.rmid) : null,
    };
  }
}
