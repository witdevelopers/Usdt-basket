import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

interface Member {
  userID: string;
  memId: string;
  lmid: string;
  rmid: string;
  srno: string;
  recLmid?: string;
  recRmid?: string;
  memIdDetails?: string; // raw string from API if available
}

interface TreeNode {
  member: Member;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
  memIdDetails?: string;
  userDetail?: UserDetail;
}

interface UserDetail {
  srno?: string;
  userID: string;
  userName: string;
  selfBV: number;
  teamBV: number;
  status: string;
  topDate: string;
}

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TreeNodeComponent implements OnInit, OnChanges {
  @Input() node!: TreeNode;

  showUserDetails = false;
  isLoading = false;

  recLmidDetails: UserDetail[] = [];
  recRmidDetails: UserDetail[] = [];

  private memMap = new Map<string, Member>();
  private userDetailsMap = new Map<string, UserDetail>();

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAndBuildTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['node']?.currentValue) {
      this.loadAndBuildTree();
    }
  }

  private loadAndBuildTree(): void {
    const userId = sessionStorage.getItem('address');
    if (!userId) {
      console.error('User address not found in session.');
      return;
    }

    this.isLoading = true;

    this.userService.getPoolTree(userId).subscribe({
      next: (response: any) => {
        const data = response?.data?.table;

        if (!Array.isArray(data)) {
          console.warn('Tree data is not valid:', data);
          this.isLoading = false;
          return;
        }

        this.memMap.clear();
        this.userDetailsMap.clear();

        data.forEach((item: any) => {
          if (item.memId) {
            const member: Member = {
              userID: item.userID,
              memId: item.memId,
              lmid: item.lmid ?? '0',
              rmid: item.rmid ?? '0',
              srno: item.memId,
              recLmid: item.recLmid,
              recRmid: item.recRmid,
              memIdDetails: item.memIdDetails // Adjust if API differs
            };
            this.memMap.set(member.memId, member);

            if (member.memIdDetails) {
              const userDetail = this.parseMemIdDetails(member.memIdDetails);
              this.userDetailsMap.set(member.memId, userDetail);
            } else {
              this.userDetailsMap.set(member.memId, {
                srno: member.memId,
                userID: 'N/A',
                userName: 'Unknown',
                selfBV: 0,
                teamBV: 0,
                status: 'Unknown',
                topDate: new Date().toLocaleString(),
              });
            }
          }
        });

        if (this.node && this.node.member) {
          const builtTree = this.buildTree(this.node.member.memId);
          if (builtTree) {
            this.node = builtTree;
          }

          this.recLmidDetails = [];
          this.recRmidDetails = [];

          if (this.node.left) {
            this.collectUserDetails(this.node.left, this.recLmidDetails);
          }
          if (this.node.right) {
            this.collectUserDetails(this.node.right, this.recRmidDetails);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private buildTree(rootMemId: string): TreeNode | null {
    if (!rootMemId || rootMemId === '0') {
      return null;
    }

    const rootMember = this.memMap.get(rootMemId);
    if (!rootMember) {
      return null;
    }

    const rootNode: TreeNode = {
      member: rootMember,
    };

    const queue: TreeNode[] = [rootNode];

    while (queue.length > 0) {
      const currentNode = queue.shift()!;

      if (currentNode.member.lmid && currentNode.member.lmid !== '0') {
        const leftMember = this.memMap.get(currentNode.member.lmid);
        if (leftMember) {
          const leftNode: TreeNode = { member: leftMember, parent: currentNode };
          currentNode.left = leftNode;
          queue.push(leftNode);
        }
      }

      if (currentNode.member.rmid && currentNode.member.rmid !== '0') {
        const rightMember = this.memMap.get(currentNode.member.rmid);
        if (rightMember) {
          const rightNode: TreeNode = { member: rightMember, parent: currentNode };
          currentNode.right = rightNode;
          queue.push(rightNode);
        }
      }
    }

    return rootNode;
  }

  private collectUserDetails(node: TreeNode, detailsArray: UserDetail[]): void {
    if (!node || !node.member) return;

    const userDetail = this.userDetailsMap.get(node.member.memId);
    if (userDetail) {
      detailsArray.push(userDetail);
    } else {
      detailsArray.push({
        srno: node.member.memId,
        userID: 'N/A',
        userName: 'Unknown',
        selfBV: 0,
        teamBV: 0,
        status: 'Unknown',
        topDate: new Date().toLocaleString(),
      });
    }

    if (node.left) {
      this.collectUserDetails(node.left, detailsArray);
    }
    if (node.right) {
      this.collectUserDetails(node.right, detailsArray);
    }
  }

  private parseMemIdDetails(detailsStr: string): UserDetail {
    // memIdDetails format example: "277,0x3c9f5b13B4DCCf9A2853E00D3F3B86d23A230349,0x01980def8ab533fdc8844128c88c6feadc6d3cc4,Bronze"
    const parts = detailsStr.split(',');

    return {
      srno: parts[0] ?? 'N/A',
      userID: parts[1] ?? 'N/A',
      userName: parts[2] ?? 'Unknown',
      selfBV: 0,
      teamBV: 0,
      status: parts[3] ?? 'Inactive',
      topDate: new Date().toLocaleString(),
    };
  }

  onAddUser(direction: 'left' | 'right'): void {
    this.router.navigate(['/auth/signup'], {
      queryParams: { direction, parentId: this.node.member.srno }
    });
  }

public expandedNodes = new Set<string>();

toggleNodeDetails(memId: string): void {
  if (this.expandedNodes.has(memId)) {
    this.expandedNodes.delete(memId);
  } else {
    this.expandedNodes.add(memId);
  }
}

isExpanded(memId: string): boolean {
  return this.expandedNodes.has(memId);
}

parseMemIdDetailsStr(detailsStr: string): {
  memid: string;
  userID: string;
  sponsor: string;
  status: string;
  time: string;
} {
  const parts = detailsStr.split(',');
  return {
    memid: parts[0] ?? 'N/A',
    userID: parts[1] ?? 'N/A',
    sponsor: parts[2] ?? 'N/A',
    status: parts[3] ?? 'N/A',
    time: parts[4] ?? new Date().toLocaleString(),
  };
}


  formatUserId(userId: string | undefined): string {
    if (!userId) return '';
    return `${userId.slice(0, 6)}...${userId.slice(-7)}`;
  }
}
