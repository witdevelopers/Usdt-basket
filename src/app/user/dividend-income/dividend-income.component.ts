import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dividend-income',
  templateUrl: './dividend-income.component.html',
  styleUrls: ['./dividend-income.component.css'],
  standalone: true,
})
export class DividendIncomeComponent implements OnInit {
  directs: any = [];

  constructor(private api: UserService) {
    this.getdiveidend();
  }
  // this.Level
  // level: any
  async getdiveidend() {
    this.directs = [];

    let res = ((await this.api.dividendIncome()) as any).data.table;

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
