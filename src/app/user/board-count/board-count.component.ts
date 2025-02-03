import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { ContractService } from 'src/app/services/contract.service';
import { UserService } from '../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-count',
  templateUrl: './board-count.component.html',
  styleUrls: ['./board-count.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, FormsModule],
})
export class BoardCountComponent implements OnInit {
  selectedValue: string;

  BoardCount: any = [];

  BoardEntries: any = [];

  BoardPools: any = [];

  constructor(private api: UserService) {}

  async GetBoardEntries() {
    this.BoardEntries = [];
    // console.log(this.BoardEntries)
    let res = (await this.api.BoardEntries(this.selectedValue)) as any;

    // console.log(res)

    if (res && res.status) {
      this.BoardEntries = res;
    } else {
      this.BoardEntries = [];
    }
    console.log(this.BoardEntries);
  }

  async GetBoardCount() {
    this.BoardCount = [];

    // console.log(this.BoardCount)

    let res = (await this.api.BoardCount) as any;

    if (res && res.status) {
      this.BoardCount = res;
    } else {
      this.BoardCount = [];
    }
    console.log(this.BoardCount);
  }

  async GetBoardPools() {
    let res = (await this.api.BoardPools()) as any;

    if (res && res.status) {
      this.BoardPools = res.data.table;
    } else {
      this.BoardPools = [];
    }
    console.log(this.BoardPools);
  }

  ngOnInit(): void {
    //  this.GetBoardCount()
    //  this.GetBoardEntries()
    this.GetBoardPools();
  }

  onSubmit() {}
}
