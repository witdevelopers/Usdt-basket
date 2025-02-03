import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-board-binary-income',
  templateUrl: './board-binary-income.component.html',
  styleUrls: ['./board-binary-income.component.css'],
  standalone: true,
})
export class BoardBinaryIncomeComponent implements OnInit {
  directs: any = [];

  isPaginated: boolean = false;
  hasNextPage: boolean = false;
  pageNo: number = 1;
  pageSize: number = 10;
  pageCount: number = 0;

  constructor(private api: UserService) {
    this.getDirects(this.pageNo);
  }

  async getDirects(pageNo: number) {
    this.directs = [];
    let res = ((await this.api.BoardIncome()) as any).data.table;

    // console.log(res)

    if (res) {
      this.directs = res;
    } else {
      this.directs = [];
    }
    // console.log(this.directs)
  }

  ngOnInit(): void {}

  OnPreviousClick() {
    if (this.pageNo > 1) {
      this.pageNo--;
      this.getDirects(this.pageNo);
    }
  }

  OnNextClick() {
    if (this.hasNextPage) {
      this.pageNo++;
      this.getDirects(this.pageNo);
    }
  }

  OnPageNoChange() {
    if (this.pageNo >= 1 && this.pageNo <= this.pageCount) {
      this.getDirects(this.pageNo);
    }
  }
}
