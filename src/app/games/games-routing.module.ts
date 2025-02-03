import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { ColorGamedashboardComponent } from './components/color-game/dashboard/color-game-dashboard.component';
import { SpinGameComponent } from './components/spin-game/spin-game.component';

const routes: Routes = [
  { path: '', component: GameListComponent, data: { label: 'Games' } },
  { path: 'games', component: GameListComponent, data: { label: 'Games' } },
  {
    path: 'color',
    component: ColorGamedashboardComponent,
    data: { label: 'Color Game' },
  },
  { path: 'spin', component: SpinGameComponent, data: { label: 'Color Game' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
