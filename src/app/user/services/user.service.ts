import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../../app-setting';
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { Categories } from 'src/app/usershop/interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private selectedAddressIdSubject = new BehaviorSubject<number | null>(null);
  private cartSubject = new BehaviorSubject<number>(0);
  cartQuantity$ = this.cartSubject.asObservable();
  private apiBaseUrl = Settings.apiUrl;

  constructor(private http: HttpClient) { }

  dashboard() {
    return new Promise((resolve, reject) => {

      this.http.get(this.apiBaseUrl + "UserDashboardDetails").subscribe((res: any) => {
        resolve(res);
      });
    });
  }



  userDashBoardDetails() {
    return new Promise((resolve, reject) => {
      const userId = sessionStorage.getItem('address');
      if (!userId) {
        reject('User ID not found in session storage');
        return;
      }
      this.http
        .get(`${this.apiBaseUrl}UserHome/UserDashboardDetails?userId=${userId}`)
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }

  adminDashboardDetails(): Observable<any> {
    return this.http.get<any>(
      `${this.apiBaseUrl}UserHome/AdminDashboardDetails`,
    ); // replace with your API endpoint
  }

  mine() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + 'Mine').subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  // api.service.ts
  generatePin(
    userId: string,
    byMemberOrAdminId: string,
    isByAdmin: boolean,
    noOfPins: string,
    remarks: string,
    packageId: string,
    PinValue: number,
    PinValuePaid: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('UserId', userId)
      .set('ByMemberOrAdminId', byMemberOrAdminId)
      .set('IsByAdmin', isByAdmin.toString())
      .set('PackageId', packageId)
      .set('NoOfPins', noOfPins)
      .set('PinValue', PinValue.toString())   // PinValue as string
      .set('PinValuePaid', PinValuePaid.toString()) // PinValuePaid as string
      .set('Remarks', remarks);

    return this.http.get(`${this.apiBaseUrl}UserHome/Generate-pin`, { params });
  }


  mlmTree(userID: string): Promise<any> {
    const params = new HttpParams().set('userID', userID);

    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.apiBaseUrl}UserHome/DirectTree`, { params })
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error);
            console.error('Error fetching MLM tree data:', error);
          },
        );
    });
  }

  binarytree(UserId: string, sponsorUserID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.apiBaseUrl}UserHome/BinaryTree?userID=${UserId}&sponsorUserID=${sponsorUserID}`;
      this.http.get(url).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err), // Handle error case
      );
    });
  }

  getChildren(parentId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Construct the URL for fetching children
      const url = `${this.apiBaseUrl}UserHome/BinaryTreeChildren?parentId=${parentId}`; // Adjust the endpoint as per your API
      this.http.get(url).subscribe(
        (res: any) => resolve(res),
        (err) => reject(err), // Handle error case
      );
    });
  }
  directs(
    UserId: string,
    startDate: string | null,
    endDate: string | null,
    statusFilter: number,
    sideFilter: number,
  ) {
    return new Promise((resolve, reject) => {
      // Construct the base URL
      let url = `${this.apiBaseUrl}UserHome/DirectDetails?userID=${UserId}&status=${statusFilter}&side=${sideFilter}`;

      // Conditionally add the startDate and endDate parameters if they are provided
      if (startDate) {
        url += `&fromDate=${startDate}`;
      }
      if (endDate) {
        url += `&endDate=${endDate}`;
      }

      // Make the HTTP GET request without headers
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  getBusinessCountDetails(
    userID: string,

  ): Observable<any> {
    let url = `${this.apiBaseUrl}UserHome/BusinessCountDetails?userID=${userID}`;
    return this.http.get<any>(url);
  }

  getroyaltyincome(
    userID: string,

  ): Observable<any> {
    let url = `${this.apiBaseUrl}UserHome/Getroyaltyincome?userID=${userID}`;
    return this.http.get<any>(url);
  }

  GetClubincome(
    userID: string,

  ): Observable<any> {
    let url = `${this.apiBaseUrl}UserHome/GetClubincome?userID=${userID}`;
    return this.http.get<any>(url);
  }

  GetAllIncomepool(
    userID: string,

  ): Observable<any> {
    let url = `${this.apiBaseUrl}UserHome/GetAllIncomepool?userID=${userID}`;
    return this.http.get<any>(url);
  }

  getSupportedCrypto(): Observable<any> {
    const endpoint = 'Account/GetSupportedCrypto?UniqueChainsOnly=false';
    return this.http.get<any>(`${this.apiBaseUrl}${endpoint}`);
  }

  updateBankDetails(
    userId: string,
    bankName: string,
    branchName: string,
    accountNo: string,
    ifsCode: string,
    accountHolderName: string,
    UPIId: string,
    Gpay: string,
    PhonePe: string,
  ): Promise<any> {
    const url = `${this.apiBaseUrl}UserHome/UpdateBankDetails?userId=${userId}&BankName=${encodeURIComponent(bankName)}&BranchName=${encodeURIComponent(branchName)}&AccountNo=${accountNo}&IFSCode=${ifsCode}&AccountHolderName=${encodeURIComponent(accountHolderName)}&UPIId=${encodeURIComponent(UPIId)}&Gpay=${encodeURIComponent(Gpay)}&PhonePe=${encodeURIComponent(PhonePe)}`;

    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      accept: '*/*',
      Authorization: `Bearer ${token}`,
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, null, { headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }


  TeamDetails(
    userId: string,
    level: number,
    startDate?: string,
    endDate?: string,
    pageNo?: number,
    pageItem?: number,
  ): Promise<any> {
    // Construct the base URL with userId and level parameters
    let url = `${this.apiBaseUrl}UserHome/TeamDetails?userID=${userId}&level=${level}&PageIndex=${pageNo}&PageSize=${pageItem}`;

    // Conditionally append startDate and endDate if they are provided
    if (startDate) {
      url += `&fromDate=${startDate}`;
    }
    if (endDate) {
      url += `&toDate=${endDate}`;
    }

    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token'); // Adjust the key according to your implementation

    // Set the Authorization header
    const headers = new HttpHeaders({
      accept: '*/*',
      Authorization: `Bearer ${token}`, // Use the retrieved token
    });

    return new Promise((resolve, reject) => {
      // Perform the HTTP GET request with headers
      this.http.get(url, { headers }).subscribe(
        (res: any) => {
          resolve(res); // Resolve the promise with the response
        },
        (error) => {
          reject(error); // Reject the promise with the error
        },
      );
    });
  }

  getTopupDetails(
    userId: string,
    userType: string,
    topUpType: string,
    fromDate: string | null,
    endDate: string | null,
    userIdForDownlineTopup: string | null = null,
    pageIndex: number,
    pageSize: number,
  ): Observable<any> {
    const apiUrl = `${this.apiBaseUrl}UserHome/TopupDetails`;

    let params = new HttpParams()
      .set('pageindex', pageIndex.toString())
      .set('pagesize', pageSize.toString());

    // Add fromDate if it exists
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    // Add endDate if it exists
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    if (topUpType) {
      params = params.set('Type', topUpType);
    }

    if (userType === 'UserDownlineTopup' && userIdForDownlineTopup) {
      params = params.set('userIdForDownlineTopup', userIdForDownlineTopup);
    } else {
      params = params.set(
        userType === 'TopupByUser' ? 'topupBy' : 'userId',
        userId,
      );
    }
    return this.http.get(apiUrl, { params });
  }

  getPinDetails(userId: string, status: string, fromDate: string, toDate: string, allottedOrTransferred: string, type: string, pinNumber: string): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/pin-details?userID=${userId}&fromDate=${fromDate}&toDate=${toDate}&type=${type}&status=${status}&allottedOrTransferred=${allottedOrTransferred}&pinNumber=${pinNumber}`;
    return this.http.get<any>(url);
  }

  getMatrixIncome(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Observable<any> {
    const url =
      `${this.apiBaseUrl}UserHome/GetMatrixIncome?userID=${userId}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    return this.http.get<any>(url);
  }

  getLevelROIIncome(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Observable<any> {
    const url =
      `${this.apiBaseUrl}UserHome/GetROILevelIncomeDetails?userID=${userId}` +
      (startDate ? `&startDate=${startDate}` : '') +
      (endDate ? `&endDate=${endDate}` : '');

    return this.http.get<any>(url);
  }

  getTotalPayoutDaily(): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetTotalPayouts_Daily`;

    return this.http.get<any>(url);
  }

  getTotalIncomeDaily(userId: string, payoutNo: number): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetTotalIncomeDetailsDaily`;
    const params: string[] = [];

    if (userId) {
      params.push(`userID=${encodeURIComponent(userId)}`);
    }

    if (payoutNo) {
      params.push(`PayoutNo=${payoutNo}`);
    }

    const queryString = params.length ? `?${params.join('&')}` : '';

    return this.http.get<any>(url + queryString);
  }

  getTotalPayoutMonthly(): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetTotalPayouts`;

    return this.http.get<any>(url);
  }

  getTotalIncomeMonthly(
    userId: string,
    payoutNo: number,
    type: number,
    amount: number,
    pageIndex: number,
    pageSize: number,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetTotalIncomeDetailsWithPagination`;
    const params: string[] = [];
    // Add parameters only if they are defined and valid
    if (userId) {
      params.push(`userID=${encodeURIComponent(userId)}`);
    }
    if (payoutNo >= 0) {
      params.push(`PayoutNo=${payoutNo}`);
    }
    if (type >= 0) {
      params.push(`Type=${type}`);
    }
    if (amount >= 0) {
      params.push(`Amount=${amount}`);
    }
    if (pageIndex > 0) {
      params.push(`PageIndex=${pageIndex}`);
    }
    if (pageSize > 0) {
      params.push(`PageSize=${pageSize}`);
    }
    // Build the query string
    const queryString = params.length ? `?${params.join('&')}` : '';
    // Make the GET request
    return this.http.get<any>(url + queryString);
  }

  updatePayoutPaymentDaily(
    userId: string,
    PayoutNo: number,
    amount: number,
  ): Observable<any> {
    // Construct the URL with query parameters
    const url = `${this.apiBaseUrl}UserHome/UpdatePayoutPayment_Daily?userID=${userId}&PayoutNo=${PayoutNo}&Amount=${amount}`;
    return this.http.put<any>(url, {}).pipe(
      tap(),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  getBinaryIncome(userId: string, payoutNo: number): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/BinaryIncome?userID=${userId}&PayoutNo=${payoutNo}`;
    return this.http.get<any>(url);
  }

  levelIncome(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetLevelIncome?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  directIncome(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetDirectIncome?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  GetLeaderShipIncomeDetails(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetLeaderShipIncomeDetails?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  GetSingleLegIncomeDetails(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetSingleLegIncomeDetails?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  // ROIIncome(userID: string, fromDate?: string, toDate?: string) {
  //   return new Promise((resolve, rejects) => {
  //     this.http
  //       .get(
  //         this.apiBaseUrl +
  //         'UserHome/ROI?userID=' +
  //         userID +
  //         (fromDate ? '&fromDate=' + fromDate : '') +
  //         (toDate ? '&toDate=' + toDate : ''),
  //       )
  //       .subscribe((res: any) => {
  //         resolve(res);
  //       });
  //   });
  // }

  profitincome(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, rejects) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetProfitIncome?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  teambonus(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, rejects) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetTeamBusinessBonus?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  leadershipbonus(userID: string, fromDate?: string, toDate?: string) {
    return new Promise((resolve, rejects) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetTeamBusinessBonus?userID=' +
          userID +
          (fromDate ? '&fromDate=' + fromDate : '') +
          (toDate ? '&toDate=' + toDate : ''),
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  placeWithdrawalOrderMlm(
    userId: string,
    walletId: number,
    amount: number,
    signature: string,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}Fund/Withdraw_crypto?userId=${userId}&WalletId=${walletId}&amount=${amount}&signature=${signature}`;
    // Endpoint for placing withdrawal
    const payload = {
      userId,
      walletId,
      amount,
      signature,
    };

    return this.http.post<any>(url, payload); // Send POST request
  }

  // Function to get withdrawal history
  getWithdrawalHistory(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${this.apiBaseUrl}Fund/GetWithdraw-MLM?UserId=${userId}`; // Endpoint for getting withdrawal history
      this.http.get<any>(url).subscribe(
        (res: any) => resolve(res), // Resolve promise with response
        (error) => reject(error), // Reject promise on error
      );
    });
  }

  blockUnblockUserStatus(memberId: number, isByAdmin: number): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/BlockUnblockUserStatus?memberId=${memberId}&isByAdmin=${isByAdmin}`;
    return this.http.post<any>(url, {});
  }

  searchUser(
    userId?: string,
    name?: string,
    mobileNo?: string,
    topupStatus?: number,
    blockedStatus?: number,
    fromDate?: string,
    toDate?: string,
  ): Observable<any> {
    let params = new HttpParams();

    // Add query parameters only if they have values
    if (userId) {
      params = params.set('userId', userId);
    }
    if (name) {
      params = params.set('name', name);
    }
    if (mobileNo) {
      params = params.set('mobileNo', mobileNo);
    }
    if (topupStatus !== undefined) {
      params = params.set('topupStatus', topupStatus.toString());
    }
    if (blockedStatus !== undefined) {
      params = params.set('blockedStatus', blockedStatus.toString());
    }
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    // Call the API with optional parameters
    return this.http.get<any>(`${this.apiBaseUrl}Userhome/UserSearch`, {
      params,
    });
  }

  salaryIncome() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetSalaryIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  deletePin(
    pinNumber: string,
    pinPassword: string,
    AdminId: number,
  ): Observable<any> {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token');

    // Set up headers with the authorization token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Construct the URL with query parameters for the DELETE request
    const url = `${this.apiBaseUrl}UserHome/DeletePin?pinNumber=${pinNumber}&pinPassword=${pinPassword}&AdminId=${AdminId}`;

    // Make the DELETE request with headers
    return this.http.delete<any>(url, { headers }).pipe(
      catchError(this.handleError), // Handle errors
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(error); // Rethrow the error for further handling
  }

  withdrawalLevelIncome() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetWithdrawalLevelIncome_APR')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  dividendIncome() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetDividendIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  POIIncome() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetPOIIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  VIPIncome() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetVIPIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  BoardIncome() {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetBoardIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  EORIncome() {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetEORIncome')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  IncomeWithdawalHistory() {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetIncomeWithdrawal')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  passbookHistory(
    Userid: string,
    walletID: number,
    fromDate: string | null,
    toDate: string | null,
    searchQuery: string | null,
  ): Observable<any> {
    // Construct the base URL
    let url = `${this.apiBaseUrl}Wallet/passbook-mlm?userId=${Userid}&WalletType=${walletID}&SearchTransaction=${searchQuery || ''}`;

    // Conditionally add fromDate and toDate parameters if they are provided
    if (fromDate) {
      url += `&Fromdate=${encodeURIComponent(fromDate)}`;
    }
    if (toDate) {
      url += `&Todate=${encodeURIComponent(toDate)}`;
    }

    // Make the HTTP GET request and return the Observable
    return this.http.get<any>(url);
  }

  getValidPan(pannumber: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.apiBaseUrl + 'Account/IsPanExists?PanNo=' + pannumber)
        .subscribe(
          (res: any) => {
            resolve(res);
          },
          (error) => {
            reject(error); // Reject promise on error
          },
        );
    });
  }

  private pinData: any;
  setPinData(data: any) {
    this.pinData = data;
  }

  getPinData() {
    return this.pinData;
  }

  getPinTransferDetails(
    userID: string,
    fromDate: string | null,
    toDate: string | null,
  ) {
    // Construct the query parameters
    let url = `${this.apiBaseUrl}UserHome/PinTransferDetails?userID=${userID}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }

    if (toDate) {
      url += `&toDate=${toDate}`;
    }

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error); // Handle errors
        },
      );
    });
  }

  getPinTransferStatistic(
    userID: string,
    fromDate: string | null,
    toDate: string | null,
  ) {
    // Construct the query parameters
    let url = `${this.apiBaseUrl}UserHome/PinStatistics?userID=${userID}`;

    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }

    if (toDate) {
      url += `&toDate=${toDate}`;
    }
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res);
        },
        (error) => {
          reject(error); // Handle errors
        },
      );
    });
  }

  getTopUpPackage(): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetTopupPackage`;
    return this.http.get<any>(url);
  }

  getAvailablePinQuantity(packId: number): Observable<any> {
    const userId = sessionStorage.getItem('userId'); // Get userId from session storage
    if (!userId) {
      throw new Error('User ID not found in session storage');
    }
    const url = `${this.apiBaseUrl}UserHome/PinAvailableQty?userID=${userId}&packid=${packId}`;
    return this.http.get<any>(url);
  }

  BoardPools() {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetBoardPools')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  BoardEntries(poolId: any) {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetBoardEntries?poolId=' + poolId)
        .subscribe((res: any) => { });
    });
  }

  BoardCount(entryId: any, poolId: any) {
    return new Promise((resolve, rejects) => {
      this.http
        .get(
          this.apiBaseUrl +
          'UserHome/GetBoardCount?entryId=' +
          entryId +
          '&poolId=' +
          poolId,
        )
        .subscribe((res: any) => {
          console.log('entryId:', entryId, 'poolId:', poolId);
        });
    });
  }

  TopupDetails() {
    return new Promise((resolve, rejects) => {
      this.http
        .get(this.apiBaseUrl + 'UserHome/GetTopupDetails')
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  DeleteTopup(pinSrno: number, isByAdmin: number): Observable<any> {
    return this.http.delete(
      `${this.apiBaseUrl}UserHome/DeleteTopUp?Pinsrno=${pinSrno}&ByadminId=${isByAdmin}`,
    );
  }

  getBanners() {
    return this.http.get(this.apiBaseUrl + 'api/Shop/banners');
  }

  getCategories(): Observable<Categories> {
    return this.http.get<Categories>(
      this.apiBaseUrl + 'api/Shop/allcategories_without_parentcategories',
    );
  }

  getProducts() {
    return this.http.get(this.apiBaseUrl + 'api/Shop/home-page/products');
  }

  getMainCategory() {
    return this.http.get(this.apiBaseUrl + 'api/Shop/allparentcategories');
  }

  getSubCategory(menuId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiBaseUrl}api/Shop/categories/${menuId}`,
    );
  }

  getHomePageSectionProduct(): Observable<any[]> {
    return this.http.get<any[]>(
      this.apiBaseUrl + 'api/Shop/home-page/products',
    );
  }

  getAllProductByCategoryId(categoryId: number): Observable<any> {
    return this.http.get<any[]>(
      this.apiBaseUrl + 'api/Shop/products-by-categoryid/' + categoryId,
    );
  }

  getProductById(productId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiBaseUrl}api/Shop/ProductDescription/${productId}`,
    );
  }

  SearchProductByKeyword(keyword: string): Observable<any> {
    return this.http.get<any>(
      this.apiBaseUrl + 'api/Shop/searchbyKeyword?keyword=' + keyword,
    );
  }

  addToCart(
    customerId: number,
    productDtId: number,
    quantity: number,
    sizeId?: number, // Make sizeId optional
  ): Observable<any> {
    console.log('Add to cart called');

    // Construct the API URL
    const apiUrl =
      `${this.apiBaseUrl}api/Shop/shopping-cart/add?customerId=${customerId}&productDtId=${productDtId}&quantity=${quantity}` +
      (sizeId !== undefined ? `&sizeId=${sizeId}` : '');

    return this.http.post<any>(apiUrl, {});
  }

  getCart(customerId: number): Observable<any> {
    this.http.get(
      `${this.apiBaseUrl}api/Shop/Getshopping-cartDetails/${customerId}`,
    ); // ADDED
    return this.http.get(
      `${this.apiBaseUrl}api/Shop/Getshopping-cartDetails/${customerId}`,
    );
  }

  loadAnonCart(): any {
    const cart = localStorage.getItem('cart');
    // return cart
    return cart ? JSON.parse(cart) : [];
  }

  updateCart(cartData: {
    customerId: number;
    productDtId: number;
    quantity: number;
  }): Observable<any> {
    return this.http.put(
      `${this.apiBaseUrl}api/Shop/shopping-cart/update`,
      cartData,
    );
  }

  removeCartItem(
    customerId: number,
    productDtId: number,
    removeAll: boolean, // Required parameter
    sizeId?: number, // Optional parameter
  ): Observable<any> {
    // Construct the base URL
    let url = `${this.apiBaseUrl}api/Shop/shopping-cart/remove?customerId=${customerId}&productDtId=${productDtId}&removeAll=${removeAll}`;

    // Append sizeId only if it's defined (i.e., not undefined or null)
    if (typeof sizeId !== 'undefined') {
      url += `&sizeId=${sizeId}`;
    }

    return this.http.delete(url);
  }

  updateCartQuantity(customerId: number): void {
    this.getCart(customerId).subscribe(
      (data: any) => {
        const totalQuantity = data.items.reduce(
          (total: number, item: any) => total + item.quantity,
          0,
        );
        this.cartSubject.next(totalQuantity);
      },
      (error) => {
        console.error('Error fetching cart details', error);
      },
    );
  }

  getAddressesByCustomerId(customerId: number): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/GetCustomerId/addresses?customerId=${customerId}`;
    return this.http.get<any>(url);
  }

  createAddress(address: any): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/CreateAddress`;
    return this.http.post<any>(url, address, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json-patch+json',
      },
    });
  }

  getWallet(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBaseUrl + 'Wallet/getWallets');
  }

  deleteAddress(customerId: number, addressId: number): Observable<any> {
    return this.http.delete(
      `${this.apiBaseUrl}api/Shop/DeleteAddress?id=${customerId}&addressid=${addressId}`,
    );
  }

  updateAddress(address: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
    });
    return this.http.put(`${this.apiBaseUrl}api/Shop/UpdateAddress`, address, {
      headers,
    });
  }

  getCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBaseUrl + 'api/Shop/countrylist');
  }

  getStatesByCountry(countryId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiBaseUrl}api/Shop/GetStatesByCountry/${countryId}`,
    );
  }

  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}api/Shop/GetPaymentMethod`);
  }

  getWalletBalance(
    walletId: number,
    userId: string,
  ): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(
      `${this.apiBaseUrl}Wallet/getBalance_MLM?walletId=${walletId}+&userId=${userId}`,
    );
  }

  createOrder(orderPayload: any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(
      `${this.apiBaseUrl}api/Shop/create-order`,
      orderPayload,
      { headers },
    );
  }

  // Set the selected address ID
  setSelectedAddressId(addressId: number): void {
    this.selectedAddressIdSubject.next(addressId);
  }

  // Get the selected address ID synchronously
  getSelectedAddressId(): number | null {
    return this.selectedAddressIdSubject.getValue();
  }

  // Method to call the invoice API using orderId from session storage
  getInvoiceByOrderNo(): Observable<any> {
    const orderId = sessionStorage.getItem('orderId'); // Retrieve orderId from session storage
    if (!orderId) {
      throw new Error('Order ID not found in session storage.');
    }
    const url = `${this.apiBaseUrl}api/Shop/invoicebyorderno?orderId=${orderId}`;
    return this.http.get<any>(url);
  }

  getOrderDetails(customerId: string): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/GetCustomerOrders/${customerId}`;
    return this.http.get<any>(url);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/cancelOrder/${orderId}`, {}); // Adjust if body is needed
  }

  nextPool(userId: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}UserHome/NextPool?UserId=${userId}`, {});
  }

  CheckForPoolUpgrade(userId: string): Observable<any>{
    return this.http.get(`${this.apiBaseUrl}UserHome/CheckForPoolUpgrade?userId=${userId}`,{});
  }

  updateCustomer(TempUserId: number, customerId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
      Accept: '*/*',
    });

    const body = {
      customerId: TempUserId,
      customerId_NewMember: customerId,
    };

    // Log the PUT request and its payload
    // console.log("Updating customer: ", body);

    // Make the PUT request
    return this.http.put(
      `${this.apiBaseUrl}api/Shop/shopping-cart-Customer/update`,
      body,
      { headers },
    );
  }

  getOrderdetailsByOrderid(orderId: string): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}api/Shop/invoicebyorderno?orderId=${orderId}`,
    );
  }

  updateOrderStatus(
    orderId: number,
    productDtId: number,
    orderStatus: number,
    modifiedBy: number,
  ): Observable<any> {
    const memberId = sessionStorage.getItem('memberId'); // Retrieve memberId from sessionStorage

    const body = {
      status: true,
      message: 'Order canceled',
      orderId: orderId,
      productDtId: productDtId, // Added productDtId as per the API requirements
      memberId: +memberId, // Ensure it's a number
      orderStatus: orderStatus, // Pass the order status (e.g., 0 for canceled)
      modifiedBy: modifiedBy, // Pass the modifiedBy (same as memberId in your case)
    };

    return this.http.post(
      `${this.apiBaseUrl}api/Shop/UpdateOrderStatus`,
      body,
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          Accept: '*/*',
        },
      },
    );
  }

  debitWallet(userId: string, amount: number): Observable<any> {
    const requestBody = {
      userId: userId,
      walletType: 1,
      type: 'Debit',
      amount: amount,
      remarks: 'order placed',
      byAdminId: 0,
    };

    return this.http.post(
      `${this.apiBaseUrl}api/Shop/CreditDebitWallet`,
      requestBody,
      {
        headers: new HttpHeaders({
          Accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        }),
      },
    );
  }

  // transferPins(userID: string, toUserId: string, packageId: number, noOfPinsToTransfer: number): Observable<any> {
  //   const url = `${this.apiBaseUrl}UserHome/PinTransfer?userID=${userID}&ToUserId=${toUserId}&PackageId=${packageId}&NoOfPinsToTransfer=${noOfPinsToTransfer}`;

  //   // Send the GET request with query parameters
  //   return this.http.get<any>(url).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error('API Error:', error);
  //       return throwError(error); // Rethrow the error for further handling
  //     })
  //   );
  // }

  transferPins(
    userID: string,
    toUserId: string,
    packageId: number,
    noOfPinsToTransfer: number,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/PinTransfer?userID=${userID}&ToUserId=${toUserId}&PackageId=${packageId}&NoOfPinsToTransfer=${noOfPinsToTransfer}`;

    // Send the POST request with parameters directly in the body
    return this.http
      .post<any>(
        url,
        {
          userID: userID,
          ToUserId: toUserId,
          PackageId: packageId,
          NoOfPinsToTransfer: noOfPinsToTransfer,
        },
        {
          headers: new HttpHeaders({
            Accept: '*/*',
            'Content-Type': 'application/json-patch+json', // Adjust content type if necessary
          }),
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('API Error:', error);
          return throwError(error); // Rethrow the error for further handling
        }),
      );
  }

  sendMessage(
    fromUserId: string,
    toUserId: string,
    isToAdmin: boolean,
    subject: string,
    message: string,
  ): Observable<any> {
    const url = `${this.apiBaseUrl
      }api/Support/InsertCompanyMessage?FromUserId=${fromUserId}&ToUserId_s=${toUserId}&IsToAdmin=${isToAdmin}&Subject=${encodeURIComponent(
        subject,
      )}&Message=${encodeURIComponent(message)}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Use POST method
    return this.http.post(url, null, { headers });
  }

  getInboxMessage(
    UserId: string,
    IsAdmin: boolean,
    IsInbox: boolean,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}api/Support/GetCompanyMessage?UserId=${UserId}&IsAdmin=${IsAdmin}&IsInbox=${IsInbox}`;
    return this.http.get(url);
  }

  getOutboxMessage(
    UserId: string,
    IsAdmin: boolean,
    IsInbox: boolean,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}api/Support/GetCompanyMessage?UserId=${UserId}&IsAdmin=${IsAdmin}&IsInbox=${IsInbox}`;
    return this.http.get(url);
  }

  changePassword(payload: any): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/ChangePassword`;

    // Set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
      Accept: '*/*',
    });

    // Make the POST request with payload and headers
    return this.http.post<any>(url, payload, { headers });
  }

  sendResetLink(email: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json-patch+json' };
    const body = { emailId: email };

    return this.http.post(
      `${this.apiBaseUrl}api/Shop/Forget-Password/SendPasswordThroughEmailID`,
      body,
      { headers },
    );
  }

  deleteInboxCompanyMessage(
    messageId: number,
    isInbox: boolean,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}api/Support/DeleteCompanyMessage?MessageId_s=${messageId}&IsInbox=${isInbox}`;
    return this.http.delete(url); // Using DELETE request to the API
  }

  deleteOutboxCompanyMessage(
    messageId: number,
    isInbox: boolean,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}api/Support/DeleteCompanyMessage?MessageId_s=${messageId}&IsInbox=${isInbox}`;
    return this.http.delete(url); // Using DELETE request to the API
  }

  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clear session storage or any other user data
      sessionStorage.clear(); // You may want to remove specific keys instead
      resolve(); // Resolve the promise after clearing data
    });
  }

  // Function to get user details by user ID
  getUserDetails(userId?: string): Observable<any> {
    // If no userId is provided, fallback to sessionStorage userId
    const userIdToUse = userId || sessionStorage.getItem('address');

    // Check if userId is available
    if (!userIdToUse) {
      throw new Error('User ID is required');
    }

    // Define headers if needed
    const headers = { 'Content-Type': 'application/json-patch+json' };

    // Append userId in the query parameters
    return this.http.get(
      `${this.apiBaseUrl}Account/GetUserDetails?UserId=${userIdToUse}`,
      { headers },
    );
  }

  // registerAddressToListener(depositAddress: string, selectedChain: string): Observable<any> {
  //   const url = `${this.apiBaseUrl}Account/RegisterAddressToListener?address=${depositAddress}&crypto=${selectedChain}`;
  //   return this.http.get<any>(url);
  // }

  registerAddressToListener(
    depositAddress: string,
    selectedChain: string,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}Account/RegisterAddressToListener?address=${depositAddress}&crypto=${selectedChain}`;
    const body = {
      address: depositAddress,
      crypto: selectedChain,
    };
    return this.http.post<any>(url, body); // Use POST method with the body
  }

  getUserCryptoDeposits(userId: string): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/GetUserCryptoDeposits?UserId=${userId}`;
    return this.http.get<any>(url);
  }

  getUserDetailsTop(userId: string): Observable<any> {
    // Get userId from session storage

    if (!userId) {
      throw new Error('User ID not found in session storage');
    }

    // Define headers if needed
    const headers = { 'Content-Type': 'application/json-patch+json' };

    // Append userId in the query parameters
    return this.http.get(
      `${this.apiBaseUrl}Account/GetUserDetails?UserId=${userId}`,
      { headers },
    );
  }

  requestForInvestment(
    userId: string,
    amount: number,
    modeOfPayment: string,
    referenceNo: string,
    remarks: string,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}Fund/RequestForInvestment?userID=${userId}&amount=${amount}&ModeOfPayment=${modeOfPayment}&ReferenceNo=${referenceNo}&Remarks=${remarks}`;

    return this.http.get<any>(url); // Use GET method for the request
  }

  getSubmittedRequestForInvestment(userId: string): Observable<any> {
    const url = `${this.apiBaseUrl}Fund/GetRequestForInvestment?UserId=${userId}`;

    return this.http.get<any>(url); // Use GET method to retrieve submitted requests
  }

  getRequestsForInvestment(
    userId: string,
    fromDate: string,
    toDate: string,
    status: string,
  ): Observable<any> {
    // Set up HttpParams with provided filter values
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    if (status) params = params.set('status', status);

    // Make GET request with parameters
    return this.http.get<any>(
      `${this.apiBaseUrl}UserHome/GetRequestsForInvestment`,
      { params },
    );
  }

  getRequestsForWithdrawlAdminSide(
    userId: string,
    fromDate: string,
    toDate: string,
    status: string,
  ): Observable<any> {
    // Set up HttpParams with provided filter values
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId);
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);
    if (status) params = params.set('status', status);

    // Make GET request with parameters
    return this.http.get<any>(
      `${this.apiBaseUrl}UserHome/GetRequestsForWithdrawlAdminSide`,
      { params },
    );
  }

  approveOrRejectRequest(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}UserHome/ApproveRejectRequest`,
      payload,
    );
  }

  approveOrRejectWithdrawlRequestAdminSide(payload: any): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}UserHome/ApproveRejectRequestWithdrawl`,
      payload,
    );
  }

  getUserDetailsValidation(userId: string): Observable<any> {
    const url = `${this.apiBaseUrl}Account/GetUserDetails?UserId=${userId}`;
    return this.http.get(url);
  }

  getPackages(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Add any necessary headers
    });

    return this.http.get(`${this.apiBaseUrl}Account/GetPackages`, { headers });
  }

  topUp(
    userId: string,
    packId: number,
    pinValue: number,
    ByMemberIdOrAdminID: number,
    isByAdmin: boolean,
    paymentMode: string,
    walletId: number,
  ): Observable<any> {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token');

    // Set the headers
    const headers = new HttpHeaders({
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    });

    // Construct the full URL with query parameters
    const url = `${this.apiBaseUrl}UserHome/Topup?userID=${userId}&packid=${packId}&pinValue=${pinValue}&IsByAdmin=${isByAdmin}&ByMemberIdOrAdminID=${ByMemberIdOrAdminID}&paymentMode=${paymentMode}&walletID=${walletId}`;

    // Make the GET request
    return this.http.get(url, { headers });
  }

  topupByEpin(
    userId: string,
    PinNumber: string,
    PinPassword: number,
    ByMemberId: number,
    ByUserType: number,
  ): Observable<any> {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token');

    // Set the headers
    const headers = new HttpHeaders({
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    });

    // Construct the full URL with query parameters
    const url = `${this.apiBaseUrl}UserHome/TopupByPin?userID=${userId}&PinNumber=${PinNumber}&PinPassword=${PinPassword}&ByMemberId=${ByMemberId}&ByUserType=${ByUserType}`;

    // Make the GET request
    return this.http.get(url, { headers });
  }

  creditDebitAmountWallet(
    userId: string,
    walletType: number,
    type: string,
    amount: number,
    remarks: string,
    byAdminId: number,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}api/Shop/CreditDebitWallet`;

    const body = {
      userId: userId,
      walletType: walletType,
      type: type,
      amount: amount,
      remarks: remarks,
      byAdminId: byAdminId,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
    });

    return this.http.post(url, body, { headers });
  }

  insertKYC(
    userId: string,
    pancardNo: string,
    panName: string,
    aadhaarNo: string,
    aadhaarName: string,
  ): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/InsertKYC?userId=${userId}&PancardNo=${pancardNo}&PanName=${panName}&AadhaarNo=${aadhaarNo}&AadhaarName=${aadhaarName}`;
    return this.http.get(url);
  }

  getKYC(userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiBaseUrl}UserHome/GetKYC?userId=${userId}&type=-1`,
    );
  }

  updateUserProfile(userId: string, profileData: any): Observable<any> {
    // Retrieve the token from session storage
    const token = sessionStorage.getItem('token');
    console.log('Update profile data:', profileData);

    // Create headers including the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    });

    // Construct the URL with query parameters
    const url =
      `${this.apiBaseUrl}UserHome/EditProfile?` +
      `userId=${userId}&` +
      `txtFirstName=${encodeURIComponent(profileData.txtFirstName)}&` +
      `txtAddress=${encodeURIComponent(profileData.txtAddress)}&` +
      `txtDistrict=${encodeURIComponent(profileData.txtDistrict)}&` +
      `ddlState=${profileData.ddlState}&` +
      `ddlCountry=${profileData.ddlCountry}&` +
      `txtPinCode=${profileData.txtPinCode}&` +
      `txtMobile=${profileData.txtMobile}&` +
      `txtEmail=${encodeURIComponent(profileData.txtEmail)}&` +
      `txtPanNo=${encodeURIComponent(profileData.txtPanNo)}`;

    // Prepare the body with profile data
    const body = {
      txtFirstName: profileData.txtFirstName,
      txtAddress: profileData.txtAddress,
      txtDistrict: profileData.txtDistrict,
      ddlState: profileData.ddlState,
      ddlCountry: profileData.ddlCountry,
      txtPinCode: profileData.txtPinCode,
      txtMobile: profileData.txtMobile,
      txtEmail: profileData.txtEmail,
      txtPanNo: profileData.txtPanNo,
    };

    // Make the POST request with the URL and body
    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(this.handleError), // Handle errors
    );
  }

  BlockUnblockROI(pinSrno: number, ByAdmin: number): Observable<any> {
    const url = `${this.apiBaseUrl}UserHome/BlockUnblockROI?pinSrno=${pinSrno}&ByAdmin=${ByAdmin}`;
    return this.http.post<any>(url, {});
  }
  updateMultipleAddresses(addresses: {
    userId: string;
    btcAddress: string;
    ethAddress: string;
    trxAddress: string;
    bscAddress: string;
    maticAddress: string;
  }): Observable<any> {
    const url =
      `${this.apiBaseUrl}UserHome/UpdateWithdrawalAddresses?` +
      `userId=${addresses.userId}&` +
      `trxAddress=${addresses.trxAddress}&` +
      `ethAddress=${addresses.ethAddress}&` +
      `btcAddress=${addresses.btcAddress}&` +
      `maticAddress=${addresses.maticAddress}&` +
      `bscAddress=${addresses.bscAddress}`;
    return this.http.get(url); // Assuming it's a GET request now, as per your example
  }


  TokenBuyHistory() {
    return new Promise((resolve, rejects) => {

      this.http.get(this.apiBaseUrl + "GetTokenBuyHistory").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  TokenSellHistory() {
    return new Promise((resolve, rejects) => {

      this.http.get(this.apiBaseUrl + "GetTokenSellHistory").subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  getMatrixTree(userID: string, sponsorUserID: string, poolID: number): Observable<any> {
    const params = new HttpParams()
      .set('userID', userID)
      .set('SponsoruserID', sponsorUserID)
      .set('PoolID', poolID.toString());
  
    // Correctly pass the API URL as a string
    return this.http.get<any>(`${this.apiBaseUrl}UserHome/GetMatrixTree`, { params });
  }

    getPoolTree(userID: string): Observable<any> {
    const params = new HttpParams()
      .set('userID', userID)
  
    // Correctly pass the API URL as a string
    return this.http.get<any>(`${this.apiBaseUrl}UserHome/PoolTree`, { params });
  }
}
