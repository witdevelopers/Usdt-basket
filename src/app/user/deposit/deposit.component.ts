import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
  standalone: true,
})
export class DepositComponent implements OnInit {
  deposit: any = [];

  constructor(private api: UserService) {
    this.GetTopupDetails();
  }
  // this.Level
  // level: any
  async GetTopupDetails() {
    this.deposit = [];

    let res = ((await this.api.TopupDetails()) as any).data.table;

    // console.log(res)

    if (res) {
      this.deposit = res;
    } else {
      this.deposit = [];
    }
    // console.log(this.data)
  }

  ngOnInit(): void {}
}
