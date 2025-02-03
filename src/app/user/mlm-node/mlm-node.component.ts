import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface MlmNode {
  userId: string;
  name: string;
  color: string;
  level: number;
  joiningAmount?: number;
  joiningDate?: string;
  leftBusiness?: number;
  rightBusiness?: number;
  totalBusiness?: number;
  totalDirects?: number; // Indicates how many direct children there are
  totalTopupAmount?: number;
  sponsorUserId?: string | null;
  children?: MlmNode[]; // Children nodes
}

@Component({
  selector: 'app-mlm-node',
  standalone: true,
  templateUrl: './mlm-node.component.html',
  styleUrls: ['./mlm-node.component.css'],
  imports: [CommonModule],
})
export class MlmNodeComponent {
  @Input() node!: MlmNode;
  @Output() nodeClicked = new EventEmitter<MlmNode>(); // Emit the clicked node
  showDetails: boolean = false; // For showing node details
  showChildren: boolean = false; // For toggling visibility of child nodes

  toggleChildren() {
    this.showChildren = !this.showChildren; // Toggle child nodes visibility
    console.log(
      `Node clicked: ${this.node.name} (ID: ${this.node.userId}), Total Directs: ${this.node.totalDirects}`,
    );
    this.nodeClicked.emit(this.node); // Emit the current node when clicked
  }
}
