import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Settings } from '../app-setting';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = Settings.apiUrl + 'Account/';
  private user: { role: string } | null = null;
  constructor(private http: HttpClient) {
    this.user = this.getUserFromLocalStorage();
  }

  private getUserFromLocalStorage(): { role: string } | null {
    const userJson = localStorage.getItem('currentUser'); // Example
    return userJson ? JSON.parse(userJson) : null;
  }

  // Commented out the previous login method using address and signature
  login(address, signature) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
            'Login?address=' +
            address +
            '&signature=' +
            signature,
        )
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  loginMLM(UserID: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          this.apiBaseUrl +
            'loginMLM?UserID=' +
            UserID +
            '&password=' +
            password,
        )
        .subscribe((res: any) => {
          resolve(res);
          console.log('Login MLM Details: ', res);
        });
    });
  }

  register(sponsorAddress,amount, transactionHash ,requestId) {
    return new Promise((resolve, reject) => {
      let payload = { sponsorAddress,amount, transactionHash ,requestId };
      this.http
        .post(this.apiBaseUrl + 'Register', payload)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  // registerMLM(userData: any): Observable<any> {
  //   // Directly return the observable from the HTTP request
  //   return this.http.post<any>(this.apiBaseUrl + 'RegisterMLM', userData);
  // }

  async registerMLM(
    txtPinNumber: number = null,      // Optional
    txtPinPassword: number = null,    // Optional
    //txtEmail: string = '',            // Optional, used as fallback for txtUserId
    //txtUserId: string = '',           // Optional
    txtMobileNo: number,              // Required
    // txtPanNumber: string, 
    // txtBankName: string,
    // txtBranchName: string,            // Required
    txtPassword: string = null,       // Optional
    txtName: string = null,           // Optional
    txtSponsorId: string = null       // Optional
  ): Promise<any> {
  
    // Construct the query parameters conditionally
    const queryParams: string[] = [];
  
    // Optional: txtPinNumber
    if (txtPinNumber) { // Check if not null, undefined, or an empty string
      queryParams.push(`txtPinNumber=${encodeURIComponent(txtPinNumber)}`);
    }
  
    // Optional: txtPinPassword
    if (txtPinPassword) { // Check if not null, undefined, or an empty string
      queryParams.push(`txtPinPassword=${encodeURIComponent(txtPinPassword)}`);
    }
  
    // Optional: txtUserId or fallback to txtEmail
    //if (txtUserId) {
    //  queryParams.push(`txtUserId=${encodeURIComponent(txtUserId)}`);
    //}
    //  else if (txtEmail) {
    //  queryParams.push(`txtUserId=${encodeURIComponent(txtEmail)}`);
    // }
  
    // Required: txtEmail
    // if (txtEmail) {
     // queryParams.push(`txtEmail=${encodeURIComponent(txtEmail)}`);
     //}
  
    // Required: txtMobileNo
    queryParams.push(`txtMobileNo=${encodeURIComponent(txtMobileNo)}`);
  
    // Required: txtPanNumber
    // queryParams.push(`txtPanNumber=${encodeURIComponent(txtPanNumber)}`);
  
    // if(txtPanNumber){
    //   queryParams.push(`txtPanNumber=${encodeURIComponent(txtPanNumber)}`);
    // }

    // if(txtBankName){
    //   // it is used for adhaar card number
    //   queryParams.push(`txtBankName=${encodeURIComponent(txtBankName)}`);
    // }

    // if(txtBranchName){
    //   // it is used for passport number
    //   queryParams.push(`txtBranchName=${encodeURIComponent(txtBranchName)}`);
    // }


    // Optional: txtPassword
    if (txtPassword) {
      queryParams.push(`txtPassword=${encodeURIComponent(txtPassword)}`);
    }
  
    // Optional: txtName
    if (txtName) {
      queryParams.push(`txtName=${encodeURIComponent(txtName)}`);
    }
  
    // Optional: txtSponsorId
    if (txtSponsorId) {
      queryParams.push(`txtSponsorId=${encodeURIComponent(txtSponsorId)}`);
    }
  
    // Construct the full query string
    const queryString = queryParams.length ? queryParams.join('&') : '';
    const url = `${this.apiBaseUrl}RegisterMLM${queryString ? '?' + queryString : ''}`;
  
    // HTTP headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: '*/*',
    });
  
    // Make HTTP POST request
    return this.http.post(url, '', { headers }).toPromise();
  }
  

  // registerMLM(fullName: string, email: string, password: string): Observable<any> {
  //   const body = { fullName, email, password };
  //   return this.http.post<any>(`${this.apiBaseUrl}RegisterMLM`, body);
  // }

  //adi start
  // Validate Sponsor ID
  isSponsorValid(sponsorId: string): Promise<any> {
    const url = `${
      this.apiBaseUrl
    }IsSponsorValid?sponsorId=${encodeURIComponent(sponsorId)}`;
    //console.log('Calling API:', url); // Log the URL

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          //   console.log('API response for isSponsorValid:', res); // Log API response
          resolve(res); // Resolve the response
        },
        (error) => {
          // console.error('Error validating sponsor:', error); // Log any errors
          reject(error.message || 'Error validating sponsor');
        },
      );
    });
  }

  isValidPin(FullPinNumber: string, pinpassword: number): Promise<any> {
    const url = `${
      this.apiBaseUrl
    }IsPinValid?FullPinNumber=${encodeURIComponent(
      FullPinNumber,
    )}&pinpassword=${pinpassword}`;

    // Log URL for debugging
    console.log('Calling API with URL:', url);

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          console.log('API response:', res); // Log API response for debugging
          if (res && res.status === true && res.data && res.data.length > 0) {
            resolve(res.data[0]); // Resolve the first pin data
          } else {
            reject(res.message || 'Invalid pin');
          }
        },
        (error) => {
          console.error('Error from API:', error); // Log any errors
          reject(error.message || 'Error validating pin');
        },
      );
    });
  }

  //end

  getPackages() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBaseUrl + 'GetPackages').subscribe((res: any) => {
        resolve(res);
      });
    });
  }

  // Add signOut method
  signOut(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Clear user session data (local storage, session storage, etc.)
      sessionStorage.clear();
      localStorage.removeItem('TempUserId'); // Remove any temp user ID if exists
      // You may also want to handle other session cleanup if necessary
      resolve(); // Resolve the promise to indicate the operation completed successfully
    });
  }
  getRegistrationSettings(): Promise<any> {
    const url = `${this.apiBaseUrl}CompanyDetails`; // Ensure this endpoint is correct
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          if (res && res.status === true) {
            resolve(res); // Assuming the response contains data in `res.data.table`
          } else {
            reject(res.message || 'Error fetching registration settings');
          }
        },
        (error) => {
          console.error('Error from API:', error);
          reject(error.message || 'Error fetching registration settings');
        },
      );
    });
  }

  isAdmin(): boolean {
    return this.user ? this.user.role === 'admin' : false;
  }
}
