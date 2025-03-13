import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './services/loader.service';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    NgxSpinnerModule,
    RouterOutlet,
    CommonModule,
  ],
})

export class AppComponent {
  constructor(
    public loader: LoaderService,
    public spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.loader.show();

    setTimeout(() => {
      this.loader.hide();
    }, 500); 
  }
}
