import { Component, OnInit, ViewChild } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class GameListComponent implements OnInit {
  constructor(private gamesService: GamesService) {}

  ngOnInit() {}
  ngOnDestroy() {}
}
