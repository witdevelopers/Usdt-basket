import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-salary-income',
  templateUrl: './salary-income.component.html',
  styleUrls: ['./salary-income.component.css'],
  standalone: true,
})
export class SalaryIncomeComponent implements OnInit {
  directs: any = [];

  constructor(private api: UserService) {
    this.getSalaryIncome();
  }
  // this.Level
  // level: any
  async getSalaryIncome() {
    this.directs = [];

    let res = ((await this.api.salaryIncome()) as any).data.table;

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
