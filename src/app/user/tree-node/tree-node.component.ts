import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

interface Member {
  userID: string;
  memId: string;
  lmid: string;
  rmid: string;
  srno: string;
  recLmid?: string;
  recRmid?: string;
  memIdDetails?: string;
}

interface TreeNode {
  member: Member;
  left?: TreeNode;
  right?: TreeNode;
  parent?: TreeNode;
  memIdDetails?: string;
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

  treeRoot!: TreeNode | null;
  treeHistory: TreeNode[] = [];
  expandedNodes = new Set<string>();
  isTouchHold = false;
  touchTimeout: any;

  private memMap = new Map<string, Member>();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (this.node?.member?.userID && this.node?.member?.memId) {
      this.loadAndBuildTree(this.node.member.userID, this.node.member.memId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['node'] &&
      this.node?.member?.userID &&
      this.node?.member?.memId
    ) {
      this.loadAndBuildTree(this.node.member.userID, this.node.member.memId);
    }
  }

  loadAndBuildTree(rootUserId: string, rootMemId: string): void {
    this.treeRoot = null;
    this.expandedNodes.clear();

    this.userService.getPoolTree(rootUserId).subscribe({
      next: (res) => {
        const data = res?.data?.table;
        if (!Array.isArray(data)) {
          return;
        }

        this.memMap.clear();
        data.forEach((item: any) => {
          if (!item.memId || item.memId === '0' || item.memId === null) return;

          this.memMap.set(item.memId, {
            userID: item.userID,
            memId: item.memId,
            lmid: item.lmid,
            rmid: item.rmid,
            srno: item.memId,
            recLmid: item.recLmid,
            recRmid: item.recRmid,
            memIdDetails: item.memIdDetails,
          });
        });

        if (!this.memMap.has(rootMemId)) {
          return;
        }

        const builtTree = this.buildTree(rootMemId);
        if (builtTree) {
          this.treeRoot = builtTree;
          this.node = this.treeRoot;
        }
      },
      error: () => { },
    });
  }

  buildTree(rootMemId: string): TreeNode | null {
    const rootMember = this.memMap.get(rootMemId);
    if (!rootMember) {
      return null;
    }

    const rootNode: TreeNode = { member: rootMember };
    const queue: TreeNode[] = [rootNode];

    while (queue.length) {
      const current = queue.shift()!;
      const left = this.memMap.get(current.member.lmid);
      const right = this.memMap.get(current.member.rmid);

      if (left) {
        current.left = { member: left };
        queue.push(current.left);
      }
      if (right) {
        current.right = { member: right };
        queue.push(current.right);
      }
    }

    return rootNode;
  }

  onNodeClick(node: TreeNode): void {
    if (!node?.member?.userID || !node?.member?.memIdDetails) {
      return;
    }

    const parsedDetails = this.parseMemIdDetailsStr(node.member.memIdDetails);
    const correctedMemId = parsedDetails.memid?.trim();

    if (!correctedMemId) {
      return;
    }

    const currentClone = this.deepCloneTree(this.treeRoot);
    if (currentClone) {
      this.treeHistory.push(currentClone);
    }

    this.loadAndBuildTree(node.member.userID, correctedMemId);
    this.router.navigate(['/user/tree', node.member.userID, correctedMemId]);
  }

  goBack(): void {
    const previous = this.treeHistory.pop();
    if (previous) {
      this.treeRoot = previous;
      this.node = this.treeRoot;
    }
  }

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

  deepCloneTree(node: TreeNode | undefined): TreeNode | undefined {
    if (!node) return undefined;

    return {
      member: { ...node.member },
      left: this.deepCloneTree(node.left),
      right: this.deepCloneTree(node.right),
    };
  }

  onTouchStart(details: any) {
    this.touchTimeout = setTimeout(() => {
      this.isTouchHold = true;
    }, 600); // 600ms for long press
  }

  onTouchEnd() {
    clearTimeout(this.touchTimeout);
  }


}
