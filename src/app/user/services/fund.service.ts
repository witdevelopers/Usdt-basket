import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FundService {
  private apiBaseUrl = Settings.apiUrl + 'Fund/';

  private apiUrlPOLY = 'https://api.polygonscan.com/api';
  private apiKeyPOLY = 'YS39IKW6IM9FZXKIUAMEYRNN74WIQR9BQV';

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

  async fetchTransactionDetails(txHash: string) {
    if (!txHash) return null;

    try {
      const [transactionRes, receiptRes] = await Promise.all([
        firstValueFrom(
          this.http.get<any>(
            `${this.apiUrlPOLY}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKeyPOLY}`
          )
        ),
        firstValueFrom(
          this.http.get<any>(
            `${this.apiUrlPOLY}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.apiKeyPOLY}`
          )
        ),
      ]);

      const transaction = transactionRes?.result;
      const receipt = receiptRes?.result;

      if (!transaction || !receipt?.logs) return null;

      // Extract ERC-20 transfer logs
      const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
      const erc20Transfers = receipt.logs
        .filter((log: any) => log.topics[0] === transferTopic)
        .map((log: any) => ({
          from: '0x' + log.topics[1].slice(26),
          to: '0x' + log.topics[2].slice(26),
          value: parseInt(log.data, 16) / 1e6,
        }));

      if (erc20Transfers.length === 0) {
        return null;
      }

      const contractAddress = transaction.to;
      const hashKey = transaction.hash;

      let apiResponses: any[] = []; 

      for (const transfer of erc20Transfers) {
        
        if (transfer.to === '0x96e6981d848fd97606705b3137ab9401ecd8cb9b' && transfer.value === 2) {
          continue; 
        }
        
        const requestBody = {
          HashKey: hashKey,
          FromAddress: transfer.from,
          ToAddress: transfer.to,
          adminAddress: transfer.to,
          toadminAmount: transfer.value, 
          totalAmount: transfer.value,
          contractAddress: contractAddress,
        };

        const response = await firstValueFrom(
          this.http.get<any>(`${this.apiBaseUrl}InsertHashKey`, { params: requestBody })
        );

        apiResponses.push(response); // Store response
      }

      return {
        transaction: { hash: hashKey, to: contractAddress },
        erc20Transfers,
        apiResponses, 
      };
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      return null;
    }
}
}
