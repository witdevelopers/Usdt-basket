import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class TeamComponent implements OnInit {
  team: any[] = [];
  filteredTeam: any[] = [];
  filterUserId: string = '';
  filterLevel: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  level: number = 0;
  pageNo: number = 1;
  pageItem: number = 100;
  pageCount: number = 0;
  isVisible: boolean = false;
  isSubmitted: boolean = false;
  message: string = '';
  showMessage: boolean = false;

  constructor(private api: UserService) {
    this.isVisible = sessionStorage.getItem('usertype') === 'Admin';
    if (this.isVisible === false) {
      this.filterUserId = sessionStorage.getItem('userId') || '';
    }
  }

  ngOnInit(): void { }

  onSearchClick() {
    this.resetPagination();
    this.fetchTeamDetails();
  }

  onPageChange() {
    this.fetchTeamDetails();
  }

  fetchTeamDetails() {
    this.isSubmitted = true;
    if (!this.filterUserId) return;

    this.api.TeamDetails(
      this.filterUserId,
      this.level,
      this.startDate,
      this.endDate,
      this.pageNo,
      this.pageItem
    )
    .then(this.handleResponse)
    .catch(this.handleError);
  }

  handleResponse = (res: any) => {
    const data = res.data.table;
    this.team = data || [];
    this.filteredTeam = [...this.team];

    if (res.status && data?.length > 0) {
      this.message = ''; // Clear message if data exists
      this.updatePagination();
    } else {
      this.message = res.message || 'No data found!';
    }

    this.showMessage = true;
  }

  handleError = (error: any) => {
    this.team = [];
    this.filteredTeam = [];
    this.message = error?.message || 'An error occurred.';
    this.showMessage = true;
  }

  updatePagination() {
    this.pageCount = Math.ceil(this.filteredTeam.length / this.pageItem);
    this.filteredTeam = this.filteredTeam.slice(
      (this.pageNo - 1) * this.pageItem,
      this.pageNo * this.pageItem
    );
  }

  onFilterChange() {
    this.filteredTeam = this.team.filter(user => this.matchFilter(user));
    this.resetPagination();
  }

  matchFilter(user: any) {
    return (
      user.userId.includes(this.filterUserId) &&
      (this.filterLevel ? user.level === Number(this.filterLevel) : true) &&
      (this.startDate ? new Date(user.topupAmount) >= new Date(this.startDate) : true) &&
      (this.endDate ? new Date(user.topupAmount) <= new Date(this.endDate) : true)
    );
  }

  resetPagination() {
    this.pageNo = 1;
    this.updatePagination();
  }

  trackByFn(index: number, item: any): number {
    return item.userId;
  }

  OnNextClick() {
    if (this.pageNo) {
      this.pageNo++;
      this.fetchTeamDetails();
      this.onSearchClick();
    }
  }

  OnPreviousClick() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.fetchTeamDetails();
    }
  }
}
