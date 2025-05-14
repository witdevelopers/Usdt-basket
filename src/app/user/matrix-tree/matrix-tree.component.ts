import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import * as d3 from 'd3';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TreeNode {
  id: string;
  userId: string;
  name: string;
  firstName: string;
  downlineCount: number;
  color: string;
  children?: TreeNode[];
  isExpanded?: boolean; // 👈 added for lazy load check
  image?: string;
}

@Component({
  selector: 'app-matrix-tree',
  templateUrl: './matrix-tree.component.html',
  styleUrls: ['./matrix-tree.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class MatrixTreeComponent implements OnInit, OnDestroy {
  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  userId: string = '';
  loading = false;
  errorMessage = '';

  private svg: any;
  private treeLayout: any;
  private diagonal: any;
  private rootNode: TreeNode | null = null;
  private viewerWidth = 0;
  private viewerHeight = 0;

  popupContent = '';
  showPopup = false;
  popupPosition = { x: 0, y: 0 };

  constructor(private treeService: UserService) {}

  ngOnInit(): void {
    this.initializeTreeContainer();
  }

  private initializeTreeContainer(): void {
    const container = this.treeContainer.nativeElement;
    this.viewerWidth = container.offsetWidth;
    this.viewerHeight = window.innerHeight * 0.8;

    this.createSVG();
    this.initializeTreeLayout();
  }

  private createSVG(): void {
    const container = this.treeContainer.nativeElement;

    const svgElement = d3.select(container)
      .append('svg')
      .attr('width', this.viewerWidth)
      .attr('height', this.viewerHeight);

    const zoomGroup = svgElement.append('g');

    svgElement.call(
      d3.zoom().scaleExtent([0.3, 3]).on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform);
      })
    );

    this.svg = zoomGroup;
  }

  private initializeTreeLayout(): void {
    this.treeLayout = d3.tree<TreeNode>().size([this.viewerWidth, this.viewerHeight]);
    this.diagonal = d3.linkVertical()
      .x((d: any) => d.x)
      .y((d: any) => d.y);
  }

  showTree(): void {
    if (!this.userId) return;

    this.loading = true;
    this.errorMessage = '';

    this.treeService
      .getMatrixTree(this.userId, '', 1)
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Failed to load tree data';
          return of(null);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        if (data) {
          const formattedData = this.formatSingleUser(data.data.table[0]);
          this.rootNode = formattedData;
          this.renderTree(this.rootNode);
        }
      });
  }

 private formatSingleUser(member: any): TreeNode {
  let icon = '';

  if (member.color === 'Green') {
    icon = 'assets/green.png'; 
  } else if (member.color === 'Red') {
    icon = 'assets/red.png';
  } else {
    icon = ''; 
  }

  return {
    id: member.userId,
    userId: member.userId,
    name: member.name?.trim() || 'No Name',
    firstName: member.firstName?.trim() || 'Unknown',
    downlineCount: member.downlineCount,
    color: member.color,
    image: icon, // set based on color
    children: [],
    isExpanded: false,
  };
}

  private renderTree(treeData: TreeNode): void {
    this.svg.selectAll('*').remove();

    const root = d3.hierarchy<TreeNode>(treeData);
    const treeNodes = this.treeLayout(root);
    const links = treeNodes.links();

    // Draw links
    this.svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', this.diagonal)
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);

    const nodeElements = this.svg
      .selectAll('.node')
      .data(treeNodes.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => this.onNodeClick(d.data))
      .on('mouseover', (event, d) => this.showNodePopup(d.data))
      .on('mouseout', () => this.hideNodePopup());

    // Avatar
    nodeElements
      .append('image')
      .attr('xlink:href', (d) => d.data.image)
      .attr('x', -20)
      .attr('y', -20)
      .attr('width', 40)
      .attr('height', 40)
      .attr('clip-path', 'circle(20px at center)');

    // First name
    nodeElements
      .append('text')
      .attr('dy', 35)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .text((d) => d.data.firstName);

    // Shortened userId
    nodeElements
      .append('text')
      .attr('dy', 50)
      .style('font-size', '10px')
      .style('text-anchor', 'middle')
      .text((d) => d.data.userId.slice(0, 6) + '...');
  }

  private onNodeClick(node: TreeNode): void {
    if (node.isExpanded) {
      console.log('Already expanded');
      return;
    }

    this.loading = true;
    this.treeService
      .getMatrixTree(node.userId, '', 1)
      .pipe(
        catchError(() => of(null)),
        finalize(() => (this.loading = false))
      )
      .subscribe((data) => {
        if (data) {
          const children = (data.data.table || []).map((member: any) => this.formatSingleUser(member));
          node.children = children;
          node.isExpanded = true;
          this.renderTree(this.rootNode!);
        }
      });
  }

  private showNodePopup(node: TreeNode): void {
    this.popupContent = `
      <div class="node-popup">
        <h4>${node.name}</h4>
        <p>User ID: ${node.userId}</p>
        <p>Downline Count: ${node.downlineCount}</p>
      </div>
    `;
    this.showPopup = true;
  }

  hideNodePopup(): void {
    this.showPopup = false;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.popupPosition = {
      x: event.clientX + 10,
      y: event.clientY + 10,
    };
  }

  ngOnDestroy(): void {
    if (this.svg) {
      this.svg.remove();
    }
  }
}
