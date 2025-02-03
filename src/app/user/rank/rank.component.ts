import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css'],
  standalone: true,
})
export class RankComponent implements OnInit {
  VIPIncome: any = [];

  constructor(private api: UserService) {
    this.getVIPIncome();
  }
  // this.Level
  // level: any
  async getVIPIncome() {
    this.VIPIncome = [];

    let res = ((await this.api.VIPIncome()) as any).data.table;

    // console.log(res)

    if (res) {
      this.VIPIncome = res;
    } else {
      this.VIPIncome = [];
    }
    // console.log(this.data)
  }

  ngOnInit(): void {}
}
