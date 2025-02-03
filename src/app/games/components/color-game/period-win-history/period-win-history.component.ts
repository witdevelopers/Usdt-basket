import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { GamesService } from 'src/app/games/services/games.service';
import { periodWinResponse } from 'src/app/games/models/bet.model';
import { PaginationEvent } from 'src/app/models/pagination-event';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-period-win-history',
  templateUrl: './period-win-history.component.html',
  styleUrls: ['./period-win-history.component.css'],
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatDialogModule],
})
export class PeriodWinHistoryComponent implements OnInit {
  constructor(private game: GamesService) {}

  pageNo: number = 1;
  pageSize: number = 10;
  periodHistory: periodWinResponse = new periodWinResponse();

  ngOnInit(): void {}

  getContrastingColor(color: string): string {
    // Logic to determine contrasting color (e.g., white or black)
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 255000;
    return brightness > 0.5 ? 'black' : 'white'; // Adjust as needed
  }

  bindHistory() {
    this.game.periodWinHistory(this.pageNo, this.pageSize).subscribe((resp) => {
      this.periodHistory.data = resp.data;
      this.periodHistory.total = resp.total;
    });
  }

  onPageChange(e) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex + 1;
    this.bindHistory();
  }

  getColor(colorName: string) {
    return colorName;
  }
}
