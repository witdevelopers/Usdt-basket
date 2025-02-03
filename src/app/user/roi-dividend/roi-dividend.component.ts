import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { ContractService } from 'src/app/services/contract.service';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-roi-dividend',
  templateUrl: './roi-dividend.component.html',
  styleUrls: ['./roi-dividend.component.css'],
  standalone: true,
})
export class RoiDividendComponent implements OnInit {
  earnonReflection: any = [];
  TokenBalance: number;
  IsArchiveNeeded: boolean;
  archivedROI: number;
  _startId: number;
  RecordsLimit: number;

  // earnonReflection: any = [];

  constructor(
    private api: UserService,
    private contractService: ContractService,
  ) {
    this.getEOR();
  }

  async getEOR() {
    this.earnonReflection = [];

    let res = ((await this.api.POIIncome()) as any).data.table;

    // console.log(res)

    if (res) {
      this.earnonReflection = res;
    } else {
      this.earnonReflection = [];
    }
    // console.log(this.data)
  }

  ngOnInit(): void {}
}
