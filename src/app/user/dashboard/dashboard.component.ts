import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { UserService } from '../services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [MatButtonModule, CommonModule],
})
export class DashboardComponent implements OnInit {
  isAdmin: any;
  isVisible: boolean = false;
  website: any;
  userAddress: any;
  userInfo: any;
  userInfoT2: any[] = [];
  blockchainExplorer: any;
  contractAddress: any;
  coinName: any;
  coinSymbol: any;
  CoinPrice: any;
  paymentToken: string = Settings.paymentToken;
  userInfoT3: any;
  toDate: number = 0;
  nextDate: number = 0;
  timeLeftDays: string = '00';
  timeLeftHours: string = '00';
  timeLeftMinutes: string = '00';
  timeLeftSeconds: string = '00';
  timeLeft: string = 'Loading...';
  interval: any;
  userInfoT4: any[] = [];

  constructor(private api: UserService, private company: CompanyService) {}

  ngOnInit() {
    this.getUserInfo();
    this.fetchDashboardData();
  }

  async getUserInfo() {
    this.userAddress = sessionStorage.getItem("address")!;
    this.isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    this.website = Settings.website;
    this.blockchainExplorer = Settings.explorer;
    this.contractAddress = Settings.contractAddress;
    this.coinName = Settings.coinName;
    this.coinSymbol = Settings.coinSymbol;
  }

  async fetchDashboardData() {
    let response = (await this.api.userDashBoardDetails()) as any;
    this.userInfo = response.data.table[0];
    this.userInfoT2 = response.data.table2;
    this.userInfoT3 = response.data.table3[0];
    this.userInfoT4 = response.data.table4;

    if (this.userInfoT3 && this.userInfoT3.toDate && this.userInfoT3.nextDate) {
      this.toDate = new Date(this.userInfoT3.toDate).getTime();
      this.nextDate = new Date(this.userInfoT3.nextDate).getTime();
      if (isNaN(this.toDate) || isNaN(this.nextDate)) {
        return;
      }
      this.startCountdown();
    }
  }

  startCountdown() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      const now = new Date().getTime();
      if (now < this.toDate) {
        return;
      }
      const remainingTime = this.nextDate - now;

      if (remainingTime <= 0) {
        clearInterval(this.interval);
        this.timeLeftDays = this.timeLeftHours = this.timeLeftMinutes = this.timeLeftSeconds = '00';
        return;
      }

      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      this.timeLeftDays = this.formatTime(days);
      this.timeLeftHours = this.formatTime(hours);
      this.timeLeftMinutes = this.formatTime(minutes);
      this.timeLeftSeconds = this.formatTime(seconds);
    }, 1000);
  }

  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
