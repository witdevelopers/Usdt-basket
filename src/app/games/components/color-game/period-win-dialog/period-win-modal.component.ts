import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-period-win-modal',
  templateUrl: './period-win-modal.component.html',
  styleUrls: ['./period-win-modal.component.css'],
  standalone: true,
  imports: [MatDialogModule],
})
export class PeriodWinModalComponent implements OnInit {
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}

  getColor(colorName: string) {
    if (colorName == 'green') {
      return '#4caf50';
    } else if (colorName == 'red') {
      return '#f44336';
    } else if (colorName == 'violet') {
      return 'rgb(156, 39, 176)';
    } else {
      return '#2196f3';
    }
  }

  getClass(color: string) {
    switch (color) {
      case 'Red':
        return 'w-red';
      case 'Green':
        return 'w-green';
      default:
        return 'w-violet';
    }
  }
}
