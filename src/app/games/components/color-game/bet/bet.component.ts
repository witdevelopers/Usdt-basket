import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MatDialogState,
} from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AddBetComponent } from '../add-bet-dialog/add-bet.component';
import { PeriodWinModalComponent } from '../period-win-dialog/period-win-modal.component';
import { GamesService } from 'src/app/games/services/games.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
  standalone: true,
  imports: [CommonModule, MatDialogModule],
})
export class BetComponent implements OnInit {
  periodWinDialogRef: MatDialogRef<PeriodWinModalComponent>;
  addBetDialogRef: MatDialogRef<AddBetComponent>;
  disableBet: string = '';
  private subscription: Subscription;
  period: string;

  public timeDifference: number;
  public secRemains: number = 0;
  public minRemains: number = 0;

  @Output() updateEvent = new EventEmitter();

  constructor(
    private game: GamesService,
    private dialog: MatDialog,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private initiateTimer(timeDifference: number) {
    if (timeDifference < 0) {
      return;
    }

    this.secRemains = Math.floor(timeDifference % 60);
    this.minRemains = Math.floor(timeDifference / 60);

    // Check if the timer is about to expire
    if (this.minRemains === 0 && this.secRemains <= 30) {
      // Close the AddBet dialog if it is open
      if (this.addBetDialogRef?.getState() === MatDialogState.OPEN) {
        this.addBetDialogRef.close({ event: 'Close' });
      }
      // Disable betting if under 30 seconds
      this.disableBet = 'disable-bet';
    } else {
      // Enable betting again if more than 30 seconds remain
      this.disableBet = '';
    }

    // When the timer reaches zero
    if (this.minRemains === 0 && this.secRemains === 0) {
      setTimeout(() => {
        this.getPeriodResult();
        this.refresh();
        this.updateEvent.emit();
      }, 2000);
    }
  }

  refresh() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.game.current().subscribe((resp) => {
      this.period = resp.period;
      this.timeDifference = resp.secRemainings;

      // Check if timeDifference is valid
      if (this.timeDifference >= 0) {
        this.subscription = interval(1000).subscribe(() => {
          if (this.timeDifference >= 0) {
            this.initiateTimer(this.timeDifference);
            this.timeDifference -= 1;
          }
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Time Remaining',
          text: 'The betting period has expired or is invalid.',
        });
        this.secRemains = 0;
        this.minRemains = 0;
      }
    });
  }

  getPeriodResult() {
    this.periodWinDialogRef?.close();
    this.game.getPeriodDetails(this.period).subscribe((rs: any) => {
      if (rs) {
        this.periodWinDialogRef = this.dialog.open(PeriodWinModalComponent, {
          autoFocus: false,
          width: '70%',
          data: rs,
          panelClass: 'addBet-dialog-container',
        });
      }
    });
  }

  onBet(e: Event, type: string) {
    if (e.target) {
      let elem = e.target as HTMLElement;
      if (elem) {
        let val: string;

        // Check if the target element is a button or span
        if (!['button', 'span'].includes(elem.nodeName.toLowerCase())) {
          return;
        }

        // Get the value from the button or span
        if (elem.nodeName.toLowerCase() === 'button') {
          let btn = elem as HTMLButtonElement;
          val = btn.value;
        } else if (
          elem.nodeName.toLowerCase() === 'span' &&
          elem.parentElement.nodeName.toLowerCase() === 'button'
        ) {
          let btn = elem.parentElement as HTMLButtonElement;
          val = btn.value;
        } else {
          return;
        }

        // Check if betting is allowed
        if (this.minRemains === 0 && this.secRemains < 30) {
          Swal.fire({
            icon: 'error',
            title: "Can't bet in this period. Timeout!",
          });
          return;
        }

        // Open the AddBet dialog
        this.addBetDialogRef = this.dialog.open(AddBetComponent, {
          width: '70%',
          data: { val, type: 'color-game' },
          panelClass: 'addBet-dialog-container',
        });

        this.addBetDialogRef.afterClosed().subscribe((result) => {
          if (
            result &&
            result.type === 'color-game' &&
            result.event === 'Submit'
          ) {
            this.game.addOrder(result.data).subscribe((resp) => {
              if (resp.status) {
                Swal.fire({
                  icon: 'success',
                  title: resp.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: resp.message,
                });
              }
            });
            this.updateEvent.emit();
          }
        });
      }
    }
  }
}
