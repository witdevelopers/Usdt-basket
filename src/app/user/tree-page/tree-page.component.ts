import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

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
}

@Component({
  selector: 'app-tree-page',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './tree-page.component.html',
  styleUrls: ['./tree-page.component.css'],
})
export class TreePageComponent implements OnInit {
  userId!: string;
  memId!: string;

  treeRoot: TreeNode | null = null;
  private memMap = new Map<string, Member>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = params['userId'];
      this.memId = params['memId'];

      if (this.userId && this.memId) {
        this.loadAndBuildTree(this.userId, this.memId);
      }
    });
  }

  loadAndBuildTree(rootUserId: string, rootMemId: string): void {
    this.treeRoot = null;
    this.memMap.clear();

    this.userService.getPoolTree(rootUserId).subscribe({
      next: (res) => {
        const data = res?.data?.table;
        if (!Array.isArray(data)) return;

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

        if (!this.memMap.has(rootMemId)) return;

        const builtTree = this.buildTree(rootMemId);
        if (builtTree) {
          this.treeRoot = builtTree;
        }
      },
      error: () => {},
    });
  }

  buildTree(rootMemId: string): TreeNode | null {
    const rootMember = this.memMap.get(rootMemId);
    if (!rootMember) return null;

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

  goBack(): void {
  this.location.back();
}
}
