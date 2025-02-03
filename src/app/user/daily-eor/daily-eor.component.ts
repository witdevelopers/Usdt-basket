import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-daily-eor',
  templateUrl: './daily-eor.component.html',
  styleUrls: ['./daily-eor.component.css'],
  standalone: true,
})
export class DailyEORComponent implements OnInit {
  EORIncome: any = [];

  constructor(private api: UserService) {
    this.GetEORIncome();
  }
  async GetEORIncome() {
    this.EORIncome = [];

    let res = ((await this.api.EORIncome()) as any).data.table;

    console.log(res);

    if (res) {
      this.EORIncome = res;
    } else {
      this.EORIncome = [];
    }
  }
  ngOnInit(): void {}
}
