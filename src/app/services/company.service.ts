import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Settings } from '../app-setting';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiBaseUrl: string = Settings.apiUrl + 'Account/';
  public routes = [];

  public companyDetails: any;
  public packages: any[] = [];
  public topupPackages: any[] = [];

  constructor(private http: HttpClient) {}

  async getCompanyDetails() {
    if (!this.companyDetails) {
      let url = this.apiBaseUrl + 'CompanyDetails';

      try {
        let result = await firstValueFrom(this.http.get(url));

        // Check if 'table' exists and assign it to 'companyDetails'
        if (
          result['data'] &&
          result['data']['table'] &&
          result['data']['table'].length > 0
        ) {
          this.companyDetails = result['data']['table'][0];

          // Store 'isBinary' in session storage
          const isBinary = this.companyDetails.isBinary;
          const isEpinSystem = this.companyDetails.isEpinSystem;
          const isCryptoSystem = this.companyDetails.isCryptoSystem;
          const isTopUpSystem = this.companyDetails.isTopUpSystem;
          const isLevelCommission = this.companyDetails.isLevelCommission;
          const isDirectCommission = this.companyDetails.isDirectCommission;
          const isROICommission = this.companyDetails.isROICommission;
          const isMatrixPlan = this.companyDetails.isMatrixPlan;
          const isLevelROICommission = this.companyDetails.isLevelROICommission;

          sessionStorage.setItem('isBinary', isBinary.toString());
          sessionStorage.setItem('isEpinSystem', isEpinSystem.toString());
          sessionStorage.setItem('isCryptoSystem', isCryptoSystem.toString());
          sessionStorage.setItem('isTopUpSystem', isTopUpSystem.toString());
          sessionStorage.setItem(
            'isLevelCommission',
            isLevelCommission.toString(),
          );
          sessionStorage.setItem(
            'isDirectCommission',
            isDirectCommission.toString(),
          );
          sessionStorage.setItem('isROICommission', isROICommission.toString());
          sessionStorage.setItem('isMatrixPlan', isMatrixPlan.toString());
          sessionStorage.setItem(
            'isLevelROICommission',
            isLevelROICommission.toString(),
          );
        }

        // Check if 'table1' exists and assign it to 'packages'
        if (
          result['data'] &&
          result['data']['table1'] &&
          result['data']['table1'].length > 0
        ) {
          this.packages = result['data']['table1'];
        }

        // Handle 'table2' if it exists, otherwise set an empty array
        if (result['data']['table2']) {
          this.topupPackages = result['data']['table2'];
        } else {
          this.topupPackages = []; // Default empty array
        }
      } catch (error) {}
    }

    return this.companyDetails;
  }
}
