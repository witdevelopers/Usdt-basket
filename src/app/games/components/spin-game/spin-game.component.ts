import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../services/games.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { userBetOrders } from '../../models/bet.model';
import Swal from 'sweetalert2';
import { AddBetComponent } from '../color-game/add-bet-dialog/add-bet.component';
import { SpinGameService } from '../../services/spin-game.service';
import { MatPaginatorModule } from '@angular/material/paginator';

declare function createWheel(): any;
declare function startWheel(stopAngle: number): any;

@Component({
  selector: 'app-spin-game',
  templateUrl: './spin-game.component.html',
  styleUrls: ['./spin-game.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    // Other imports...
  ],
  providers: [DatePipe],
})
export class SpinGameComponent implements OnInit {
  selectedItem: any;
  betPlacedOn = '';
  isBetPlaced = false;
  spinCompleted = false;
  numberWon: number = null;
  colorWon: string = null;
  userInfo: any = {};
  pageSize = 10;
  pageNo = 1;
  addBetDialogRef: MatDialogRef<AddBetComponent>;

  constructor(
    public dialog: MatDialog,
    private game: GamesService,
    public datePipe: DatePipe,
    public loader: LoaderService,
    private ngZone: NgZone,
    private spinGame: SpinGameService,
  ) {}

  ngOnInit() {
    window['spinWheelComponentReference'] = {
      component: this,
      zone: this.ngZone,
      onSelectItem: (item) => this.onSelectItem(item),
      onSpinCompleted: () => this.onSpinCompleted(),
    };
  }

  ngOnDestroy() {}

  ngAfterViewInit() {
    this.getUserOrders();
    this.getBalance();
    createWheel();
  }

  getUserOrders() {
    this.spinGame.getAllOrders(this.pageNo, this.pageSize).subscribe((resp) => {
      this.userInfo.orders = resp.data;
      this.userInfo.total = resp.total;
    });
  }

  getBalance() {
    this.spinGame.getBalance().subscribe((resp) => {
      this.userInfo.walletBalance = resp.balanceAmount;
    });
  }

  onSelectItem(item: any) {
    this.selectedItem = item;
  }

  isNumber(val: any): boolean {
    return !isNaN(Number(val));
  }

  onAddOrder(val: any) {
    if (val != 0 && !val) {
      Swal.fire({
        icon: 'error',
        title: 'Select a number from spin board and Place Order',
      });
      return;
    }
    this.addBetDialogRef = this.dialog.open(AddBetComponent, {
      width: '70%',
      data: { val, type: 'spin-game' },
      panelClass: 'addBet-dialog-container',
    });

    this.addBetDialogRef.afterClosed().subscribe((result) => {
      if (result && result.type === 'spin-game' && result.event === 'Submit') {
        this.spinGame.placeBetOrder(result.data).subscribe((resp) => {
          if (resp.status && resp.data.winNumber >= 0) {
            this.isBetPlaced = resp.status;
            this.betPlacedOn = val;
            this.getBalance();
            Swal.fire({
              icon: 'success',
              title: resp.message,
            }).then(() => {
              setTimeout(() => {
                const totalSegments = 10;
                this.numberWon = resp.data.winNumber;
                const stopAngle =
                  (360 / totalSegments) * (this.numberWon + 1) -
                  360 / totalSegments / 2;
                startWheel(stopAngle);
              }, 200);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: resp.message,
            });
          }
        });
      }
    });
  }

  resetWheel() {
    this.isBetPlaced = false;
    this.betPlacedOn = '';
    this.selectedItem = null;
    this.spinCompleted = false;
    this.numberWon = null;
    this.colorWon = null;
    createWheel();
  }

  onSpinCompleted() {
    this.spinCompleted = true;
    this.getUserOrders();
    this.getBalance();
    createWheel();
  }

  onPageChange(e: any) {
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex + 1;
    this.getUserOrders();
  }
}
