import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GameListComponent } from './components/game-list/game-list.component';
import { GamesRoutingModule } from './games-routing.module';
//import { ColorGameComponent } from './components/color-game/dashboard/color-game-dashboard.component';
import { SpinGameComponent } from './components/spin-game/spin-game.component';
import { UserPaginationComponent } from '../shared/pagination/pagination.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PeriodWinHistoryComponent } from './components/color-game/period-win-history/period-win-history.component';
import { BetComponent } from './components/color-game/bet/bet.component';
import { RuleComponent } from './components/color-game/rule-dialog/rule.component';
import { RouterModule } from '@angular/router';
// import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddBetComponent } from './components/color-game/add-bet-dialog/add-bet.component';
import { PeriodWinModalComponent } from './components/color-game/period-win-dialog/period-win-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    // GameListComponent,
    // ColorGameComponent,
    // SpinGameComponent,
    // UserPaginationComponent,
    // PeriodWinHistoryComponent,
    // BetComponent,
    // RuleComponent,
    // AddBetComponent,
    // PeriodWinModalComponent,
  ],
  imports: [
    // CommonModule,
    // RouterModule,
    // MaterialModule,
    // FormsModule,
    // GamesRoutingModule,
    // MatButtonModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatTableModule,
    // MatSelectModule,
    // MatOptionModule,
    // MatIconModule,
    // MatDialogModule,
    // MatCheckboxModule,
    // MatPaginatorModule,
  ],
  exports: [
    // RouterModule,
    // MaterialModule,
    // FormsModule,
    // GamesRoutingModule,
    // MatButtonModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatTableModule,
    // MatSelectModule,
    // MatOptionModule,
    // MatIconModule,
    // MatDialogModule,
    // MatCheckboxModule,
    // MatPaginatorModule,
  ],
  providers: [DatePipe],
})
export class GamesModule {}
