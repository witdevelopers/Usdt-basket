import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BetModel } from '../models/bet.model';
import { ApiUrl } from './api-constants';

@Injectable({
  providedIn: 'root',
})
export class SpinGameService {
  url = ApiUrl.SpinGame;
  constructor(private http: HttpClient) {}

  placeBetOrder(model: BetModel) {
    return this.http.post<any>(this.url.addOrder, model);
  }

  getAllOrders(pageNo: number, pageSize: number) {
    return this.http.get<any>(
      this.url.getOrders + '?pageNo=' + pageNo + '&pageSize=' + pageSize,
    );
  }

  getBalance() {
    return this.http.get<any>(this.url.getBalance);
  }
}
