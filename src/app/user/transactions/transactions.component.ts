import { Component, OnInit } from '@angular/core';
import { Settings } from 'src/app/app-setting';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  standalone: true,
})
export class TransactionsComponent implements OnInit {
  paymentToken: string = Settings.paymentToken;
  tokenSymbol: string = Settings.coinSymbol;
  transactions: any = [];

  constructor(private contractService: ContractService) {
    this.getTransactions();
  }

  ngOnInit(): void {}

  async getTransactions() {
    // var _transactions = (await this.contractService.getUserTransactionHistory(sessionStorage.getItem("memberId"))).data;
    // //console.log(_ranks);
    // let maticToWei = Math.pow(10, 18);
    // for(var i=0; i<_transactions.length; i++)
    // {
    //   let temp_transaction:any = _transactions[i];
    //   var transactionsObject = {
    //     Srno: i+1,
    //     MaticAmount: temp_transaction.Amount/maticToWei,
    //     TokenAmount: temp_transaction.TokenAmount,
    //     Type: temp_transaction.Type
    //   };
    //   this.transactions.push(transactionsObject);
    // }
    //console.log(this.ranks)
  }
}
