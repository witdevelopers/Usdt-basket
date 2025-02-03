import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from 'src/app/app-setting';


@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private apiBaseUrl = Settings.apiUrl + 'Wallet/';

  constructor(private http: HttpClient) { }
  getWallets(FromPage: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiBaseUrl}getWallets?FromPage=${FromPage}`)
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
        });
    });
  }
  
  
  getBalance(walletId) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'getBalance?walletId=' + walletId)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  getBalanceMlm(walletId, userId) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
          'getBalance-Crypto?walletId=' +
          walletId +
          '&userId=' +
          userId,
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }
}
