import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private apiBaseUrl = Settings.apiUrl + 'Fund/';

  constructor(private http: HttpClient) {}

  invest(txnHash: string,packageId: number,amount: number) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiBaseUrl + 'Invest', {
          transactionHash: txnHash,
          packageId: packageId,
          amount: amount
        })
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  GetwithdrawIncomeCrypto(userId: string): Observable<any> {
    return this.http.get(this.apiBaseUrl + "GetRequestsForWithdrawal-Crypto?UserId=" + userId)
      .pipe(
        catchError(error => {
          console.error('Error fetching withdrawal income crypto:', error);
          return throwError(error);
        })
      );
  }

  sellToken(tokenAmount: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'SellTokens?tokenAmount=' + tokenAmount)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  withdrawIncome(amount: number, walletId: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
            'Withdraw_crypto?amount=' +
            amount +
            '&walletId=' +
            walletId,
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  withdrawMTA(amount: number) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'Withdraw_MTA?amount=' + amount)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }
}
