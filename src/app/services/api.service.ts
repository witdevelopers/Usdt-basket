import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../app-setting';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  reinvest(transactionHash) {
    return new Promise((resolve, reject) => {
      let payload = { transactionHash: transactionHash, packageId: 0 };
      this.http
        .post(Settings.apiUrl + 'Fund/Invest', payload)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  getUserDashboardDetails(address) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          Settings.apiUrl + 'UserHome/DashboardDetails?userAddress=' + address,
        )
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }

  withdraw(userAddress, amount, signature) {
    return new Promise((resolve, reject) => {
      let payload = {
        userAddress: userAddress,
        signature: signature,
        amount: amount,
      };
      this.http
        .post(Settings.apiUrl + 'Fund/Withdraw', payload)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }
}
