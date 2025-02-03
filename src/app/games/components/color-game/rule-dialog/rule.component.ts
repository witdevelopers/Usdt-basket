import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css'],
  standalone: true,
  imports: [MatDialogModule],
})
export class RuleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
