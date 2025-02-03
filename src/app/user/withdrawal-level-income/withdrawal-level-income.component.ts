import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-withdrawal-level-income',
  templateUrl: './withdrawal-level-income.component.html',
  styleUrls: ['./withdrawal-level-income.component.css'],
  standalone: true,
})
export class WithdrawalLevelIncomeComponent implements OnInit {
  directs: any = [];

  constructor(private api: UserService) {
    this.getLeveldiveidend();
  }
  // this.Level
  // level: any
  async getLeveldiveidend() {
    this.directs = [];

    let res = ((await this.api.withdrawalLevelIncome()) as any).data.table;

    // console.log(res)

    if (res) {
      this.directs = res;
    } else {
      this.directs = [];
    }
    // console.log(this.data)
  }

  ngOnInit(): void {}
}
