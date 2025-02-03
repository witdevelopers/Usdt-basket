import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import * as d3 from 'd3';
import Swal from 'sweetalert2';

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
  totalDirects?: number;
  totalTopupAmount?: number;
  sponsorUserId?: string | null;
  children?: MlmNode[];
}

@Component({
  selector: 'app-direct-tree',
  templateUrl: './direct-tree.component.html',
  styleUrls: ['./direct-tree.component.css'],
})
export class DirectTreeComponent implements OnInit {
  mlmTree: MlmNode[] = [];
  userId: string | null = null;

  @ViewChild('treeContainer', { static: true }) treeContainer!: ElementRef;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserIdFromSession();
    this.fetchMlmTree();
  }

  getUserIdFromSession(): void {
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      console.log('User ID from session:', this.userId);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'No User ID',
        text: 'No user ID found in session. Please log in again.',
      });
    }
  }

  fetchMlmTree(): void {
    if (this.userId) {
      this.userService
        .mlmTree(this.userId)
        .then((response: any) => {
          const rootNode = response.data.table[0];
          const childNodes = response.data.table1;

          this.mlmTree = this.buildTree(rootNode, childNodes);
          if (this.mlmTree.length > 0) {
            this.createTreeVisualization(this.mlmTree[0]);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'No Data',
              text: 'No nodes found to visualize.',
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch. Please try again later.',
          });
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Missing User ID',
        text: 'Cannot fetch the MLM tree without a user ID.',
      });
    }
  }

  private buildTree(rootNode: any, childNodes: any[]): MlmNode[] {
    const node: MlmNode = {
      userId: rootNode.userId,
      name: rootNode.name,
      color: rootNode.color,
      level: 0,
      children: this.findChildren(rootNode.userId, childNodes),
    };
    return [node];
  }

  private findChildren(
    sponsorUserId: string | null,
    childNodes: any[],
    level: number = 1,
  ): MlmNode[] {
    const children = childNodes
      .filter((child) => child.sponsorUserId === sponsorUserId)
      .map((child) => ({
        userId: child.userId,
        name: child.name,
        color: child.color,
        level: level,
        joiningDate: child.joiningDate,
        totalTopupAmount: child.totalTopupAmount,
        joiningAmount: child.joiningAmount,
        totalDirects: child.totalDirects,
        leftBusiness: child.leftBusiness,
        rightBusiness: child.rightBusiness,
        totalBusiness: child.totalBusiness,
        children: this.findChildren(child.userId, childNodes, level + 1),
      }));
    return children;
  }

  private createTreeVisualization(data: MlmNode): void {
    const container = this.treeContainer.nativeElement;
    const margin = { top: 50, right: 20, bottom: 50, left: 20 };
    const width = container.offsetWidth - margin.left - margin.right;
    const height = 600;

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const treeLayout = d3
      .tree<MlmNode>()
      .size([width, height - 300])
      .separation((a, b) => (a.parent === b.parent ? 2 : 1.5));

    const root = d3.hierarchy(data);
    treeLayout(root);

    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 1])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const tooltip = d3
      .select(container)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const nodeRadius = 25;

    const link = g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .linkHorizontal<
            d3.HierarchyPointNode<MlmNode>,
            d3.HierarchyPointLink<MlmNode>
          >()
          .source((d) => [d.source.x, d.source.y])
          .target((d) => [d.target.x, d.target.y]),
      );

    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
        Swal.fire({
          icon: 'info',
          title: 'Node Details',
          html: this.getNodeDetails(d.data),
        });
      })
      .on('mouseover', (event, d) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(this.getNodeDetails(d.data))
          .style('left', event.pageX + 5 + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    node
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    node
      .append('text')
      .attr('dy', 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text((d) => d.data.name);
  }

  private getNodeDetails(node: MlmNode): string {
    return `
      <table>
        <tr><th>Name:</th><td>${node.name}</td></tr>
        <tr><th>User ID:</th><td>${node.userId}</td></tr>
        <tr><th>Joining Date:</th><td>${node.joiningDate || 'N/A'}</td></tr>
        <tr><th>Joining Amount:</th><td>${node.joiningAmount || 'N/A'}</td></tr>
        <tr><th>Total Topup Amount:</th><td>${node.totalTopupAmount || 'N/A'}</td></tr>
        <tr><th>Total Directs:</th><td>${node.totalDirects || 'N/A'}</td></tr>
        <tr><th>Left Business:</th><td>${node.leftBusiness || 'N/A'}</td></tr>
        <tr><th>Right Business:</th><td>${node.rightBusiness || 'N/A'}</td></tr>
        <tr><th>Total Business:</th><td>${node.totalBusiness || 'N/A'}</td></tr>
      </table>
    `;
  }
}
