import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private apiBaseUrl = Settings.apiUrl + 'Fund/';

  constructor(private http: HttpClient) {}

  invest(txnHash: string,amount: number,packageId: number) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.apiBaseUrl + 'Invest', {
          transactionHash: txnHash,
          amount: amount,
          packageId: packageId
          
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

  async CheckSponsorIncome(userId: string): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.apiBaseUrl}CheckSponsorIncome?UserId=${userId}`));
  }
}
