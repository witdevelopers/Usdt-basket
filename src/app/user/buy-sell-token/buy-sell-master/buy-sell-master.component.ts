import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Settings } from 'src/app/app-setting';
import { ContractService } from 'src/app/services/contract.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buy-sell-master',
  templateUrl: './buy-sell-master.component.html',
  styleUrls: ['./buy-sell-master.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class BuySellMasterComponent implements OnInit {

  isBuyActive: boolean;
  maticToToken: any;
  tokenSymbol: string;

  constructor(private router: Router, private contractService: ContractService) {
    this.tokenSymbol = Settings.coinSymbol;

    let url = this.router.url;
    this.isBuyActive = !(url.substring(url.lastIndexOf('/') + 1, url.length) == "sell");

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let url = event.url;
        this.isBuyActive = !(url.substring(url.lastIndexOf('/') + 1, url.length) == "sell");
      }
    });
  }

  async ngOnInit() {
    //await this.getMemberCoinPrice();
  }

  // async getMemberCoinPrice() {

  //   let result = await this.contractService.getCoinPriceForMember(sessionStorage.getItem("memberId"));
  //   //console.log(result);
  //   this.maticToToken = result.data;
  // }
}