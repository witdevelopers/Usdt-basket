import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-master',
  templateUrl: './auth-master.component.html',
  styleUrls: ['./auth-master.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class AuthMasterComponent implements OnInit {
  logo: string = Settings.logo;
  constructor() {}

  ngOnInit(): void {}
}
