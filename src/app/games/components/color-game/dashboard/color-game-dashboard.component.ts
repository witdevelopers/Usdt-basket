import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { PeriodWinHistoryComponent } from '../period-win-history/period-win-history.component';
import { BetComponent } from '../bet/bet.component';
import { userBetOrders } from 'src/app/games/models/bet.model';
import { GamesService } from 'src/app/games/services/games.service';
import { RuleComponent } from '../rule-dialog/rule.component';
import { LoaderService } from 'src/app/services/loader.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-color-game',
  templateUrl: './color-game-dashboard.component.html',
  styleUrls: ['./color-game-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    PeriodWinHistoryComponent,
    BetComponent,
    MatDialogModule,
  ],
  providers: [DatePipe],
})
export class ColorGamedashboardComponent implements OnInit {
  @ViewChild(PeriodWinHistoryComponent) periodWin: PeriodWinHistoryComponent;
  @ViewChild(BetComponent) bet: BetComponent;

  userInfo: userBetOrders = new userBetOrders();
  allOrders = { data: [], pageNo: 1, pageSize: 10, total: 0 };
  showingAllOrders: boolean = false;

  constructor(
    public dialog: MatDialog,
    private game: GamesService,
    public datePipe: DatePipe,
    public loader: LoaderService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.refreshDashboard();
  }

  getUserOrders() {
    this.game.userDetails().subscribe((resp) => {
      this.userInfo.walletBalance = resp.walletBalance;
      this.userInfo.orders = resp.orders;
    });
  }

  refreshDashboard() {
    this.periodWin.bindHistory();
    this.getUserOrders();
  }

  openRechargeDialog() {
    // Logic for opening the recharge dialog
  }

  getColor(colorName: string) {
    switch (colorName) {
      case 'green':
        return '#4caf50';
      case 'red':
        return '#f44336';
      case 'violet':
        return 'rgb(156, 39, 176)';
      default:
        return '#2196f3';
    }
  }

  isNumber(val: any) {
    return !isNaN(Number(val));
  }

  refreshTimer() {
    this.bet.refresh(); // Assuming this refreshes the BetComponent
  }

  onRuleClick() {
    this.dialog.open(RuleComponent, {
      autoFocus: false,
      width: '90%',
      panelClass: 'addBet-dialog-container',
    });
  }

  viewAllOrders() {
    this.showingAllOrders = true;
    this.getAllOrders();
  }

  viewCurrentOrders() {
    this.showingAllOrders = false;
    this.getUserOrders();
  }

  getAllOrders() {
    this.game
      .getBetOrders(this.allOrders.pageNo, this.allOrders.pageSize)
      .subscribe((resp) => {
        this.allOrders.data = resp.data;
        this.allOrders.total = resp.total;
      });
  }

  onPageChange(e: any) {
    this.allOrders.pageSize = e.pageSize;
    this.allOrders.pageNo = e.pageIndex + 1;
    this.getAllOrders();
  }
  trackByFn(index: number, item: any): number {
    return item.id || index; // Assuming each item has a unique 'id' property; fallback to index if not
  }
}
