import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

// Services
import { ContractService } from './services/contract.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { CompanyService } from './services/company.service';
import { EncryptionService } from './usershop/encryption.service';

// Third-Party Modules
import { NgxSpinnerModule } from 'ngx-spinner';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    CountdownModule,
  ],
  providers: [
    ContractService,
    EncryptionService,
    { provide: 'Window', useValue: window },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: CompanyService) => () => config.getCompanyDetails(),
      deps: [CompanyService],
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  // bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private contractService: ContractService) {}
}
