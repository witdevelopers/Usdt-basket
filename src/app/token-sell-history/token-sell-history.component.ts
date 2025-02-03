import { Component } from '@angular/core';
import { UserService } from '../user/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token-sell-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-sell-history.component.html',
  styleUrl: './token-sell-history.component.css'
})
export class TokenSellHistoryComponent {
  directs: any = [];
  
  
  constructor(private api: UserService) {
    this.TokenSellHistory();
  }
  // this.Level
  // level: any
  async TokenSellHistory() {

    this.  directs= [];
   
    let res = ((await this.api.TokenSellHistory()) as any).data.table;
    
    // console.log(res)

    if(res){
      this.  directs = res;
    
    }
    else{
      this.  directs = [];
    
    }
    // console.log(this.data)
  }

 ngOnInit(): void{ }

}
