import { Component } from '@angular/core';
import { UserService } from '../user/services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token-buy-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './token-buy-history.component.html',
  styleUrl: './token-buy-history.component.css'
})
export class TokenBuyHistoryComponent {
  directs: any = [];
  
  
  constructor(private api: UserService) {
    this.TokenBuyHistory();
  }
  // this.Level
  // level: any
  async TokenBuyHistory() {

    this.  directs= [];
   
    let res = ((await this.api.TokenBuyHistory()) as any).data.table;
    
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
