import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2'; // For alerting the user
import { Settings } from 'src/app/app-setting';
import { UserService } from 'src/app/user/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { CountdownConfig, CountdownModule } from 'ngx-countdown';

const CountdownTimeUnits: Array<[string, number]> = [
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    MatMenuModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  @Input() secondsRemaining;
  timer: any;
  website: any;
  userAddress: any;
  userInfo: any;
  blockchainExplorer: any;
  contractAddress: any;
  coinName: any;
  coinSymbol: any;
  CoinPrice: any;

  paymentToken: string = Settings.paymentToken;
  config: CountdownConfig;

  SecondsRemainingForTopup: number = 0;
  SecondsRemainingForBooster_50: number = 0;
  time_50: string = '00:00:00:00';
  SecondsRemainingForBooster_100: number = 0;
  time_100: string = '00:00:00:00';

  userType: string | null = null;
  AdminInfo: any;
  constructor(
    private api: UserService,
    private company: CompanyService,
    private countdown: CountdownModule,
  ) {}

  ngOnInit() {
    this.userType = sessionStorage.getItem('usertype');
    this.CoinPrice = this.company.companyDetails.tokenRate;
    this.getAdminDashboardDetails(); 

    this.config = {
      leftTime: this.userInfo?.miningTimeRemaining_Seconds,
      format: 'HH:mm:ss',
      formatDate: ({ date, formatStr }) => {
        let duration = Number(date || 0);

        return CountdownTimeUnits.reduce((current, [name, unit]) => {
          if (current.indexOf(name) !== -1) {
            const v = Math.floor(duration / unit);
            duration -= v * unit;
            return current.replace(
              new RegExp(`${name}+`, 'g'),
              (match: string) => {
                if (name === 'D' && v <= 0) {
                  return '';
                }
                return v.toString().padStart(match.length, '0');
              },
            );
          }
          return current;
        }, formatStr);
      },
    };
  }

  getAdminDashboardDetails() {
    this.api.adminDashboardDetails().subscribe(
      (response) => {
        if (response && response.status) {
          this.AdminInfo = response.data.table[0];
          console.log('Default Dashboard Info:', this.AdminInfo);
        }
      },
      (error) => {
        console.error('Error fetching admin dashboard details:', error);
      },
    );
  }

  async getUserInfo() {
    this.userAddress = sessionStorage.getItem('userId')!;

    this.website = Settings.website;
    this.blockchainExplorer = Settings.explorer;
    this.contractAddress = Settings.contractAddress;
    this.coinName = Settings.coinName;
    this.coinSymbol = Settings.coinSymbol;

    this.userInfo = (
      (await this.api.userDashBoardDetails()) as any
    ).data.table[0];
    console.log(this.userInfo);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  isTimerZero(): boolean {
    return this.userInfo?.miningTimeRemaining_Seconds <= 0;
  }

  hidetimer(): boolean {
    return this.userInfo?.miningTimeRemaining_Seconds > 0;
  }
  startCountdownForTopup() {
    let that = this;
    this.timer = setInterval(function () {
      if (that.SecondsRemainingForTopup <= 0) {
        clearInterval(this.timer);
        return;
      }

      var days = Math.floor(that.SecondsRemainingForTopup / (3600 * 24));
      var hours = Math.floor(
        (that.SecondsRemainingForTopup % (3600 * 24)) / 3600,
      );
      var minutes = Math.floor((that.SecondsRemainingForTopup % 3600) / 60);
      var seconds = that.SecondsRemainingForTopup % 60;

      var formattedDays = (days < 10 ? '0' : '') + days;
      var formattedHours = (hours < 10 ? '0' : '') + hours;
      var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
      var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

      document.getElementById('timer').innerHTML =
        formattedDays +
        ' : ' +
        formattedHours +
        ' : ' +
        formattedMinutes +
        ' : ' +
        formattedSeconds;

      that.SecondsRemainingForTopup--;
    }, 1000);
  }

  startCountdownForBooster_50() {
    console.log('secondsRemaining', this.SecondsRemainingForBooster_50);
    let that = this;
    this.timer = setInterval(function () {
      if (that.SecondsRemainingForBooster_50 <= 0) {
        clearInterval(this.timer);
        return;
      }

      var days = Math.floor(that.SecondsRemainingForBooster_50 / (3600 * 24));
      var hours = Math.floor(
        (that.SecondsRemainingForBooster_50 % (3600 * 24)) / 3600,
      );
      var minutes = Math.floor(
        (that.SecondsRemainingForBooster_50 % 3600) / 60,
      );
      var seconds = that.SecondsRemainingForBooster_50 % 60;

      var formattedDays = (days < 10 ? '0' : '') + days;
      var formattedHours = (hours < 10 ? '0' : '') + hours;
      var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
      var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

      that.time_50 =
        formattedDays +
        ' : ' +
        formattedHours +
        ' : ' +
        formattedMinutes +
        ' : ' +
        formattedSeconds;

      that.SecondsRemainingForBooster_50--;
    }, 1000);
  }

  startCountdownForBooster_100() {
    console.log('secondsRemaining', this.SecondsRemainingForBooster_100);
    let that = this;
    this.timer = setInterval(function () {
      if (that.SecondsRemainingForBooster_100 <= 0) {
        clearInterval(this.timer);
        return;
      }

      var days = Math.floor(that.SecondsRemainingForBooster_100 / (3600 * 24));
      var hours = Math.floor(
        (that.SecondsRemainingForBooster_100 % (3600 * 24)) / 3600,
      );
      var minutes = Math.floor(
        (that.SecondsRemainingForBooster_100 % 3600) / 60,
      );
      var seconds = that.SecondsRemainingForBooster_100 % 60;

      var formattedDays = (days < 10 ? '0' : '') + days;
      var formattedHours = (hours < 10 ? '0' : '') + hours;
      var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
      var formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

      that.time_100 =
        formattedDays +
        ' : ' +
        formattedHours +
        ' : ' +
        formattedMinutes +
        ' : ' +
        formattedSeconds;

      that.SecondsRemainingForBooster_100--;
    }, 1000);
  }
}
