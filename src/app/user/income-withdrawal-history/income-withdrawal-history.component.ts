import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FundService } from '../services/fund.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-income-withdrawal-history',
  templateUrl: './income-withdrawal-history.component.html',
  styleUrls: ['./income-withdrawal-history.component.css'],
  standalone: true,
  imports: [ CommonModule],
})
export class IncomeWithdrawalHistoryComponent implements OnInit {

  directs: any[] = [];
  userId: string | null = null;

  constructor(private api: FundService) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('address');
    
    if (this.userId) {
      this.IncomeWithdrawalHistory();
    } else {
      console.warn('User ID not found in session storage.');
      this.directs = []; 
    }
  }

  IncomeWithdrawalHistory() {
    this.api.GetwithdrawIncomeCrypto(this.userId as string).subscribe(
      (res: any) => {
        this.directs = res?.data?.table || [];
      },
      (error) => {
        console.error('Error fetching income withdrawal history:', error);
        this.directs = []; 
      }
    );
  }
}
