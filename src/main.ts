import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { EncryptionService } from './app/usershop/encryption.service';
import { HttpInterceptorService } from './app/services/http-interceptor.service';
import { CompanyService } from './app/services/company.service';
import { routes } from './app/app-routes';
import { Settings } from 'src/app/app-setting';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CountdownModule } from 'ngx-countdown';
import { CommonModule } from '@angular/common';

if (environment.production) enableProdMode();
document.title = Settings.AppName;

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule,
      FormsModule,
      NgxSpinnerModule,
      CommonModule,
      CountdownModule,
      ReactiveFormsModule,
      AppModule
    ),
    EncryptionService,
    { provide: 'Window', useValue: window },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: APP_INITIALIZER, useFactory: (config: CompanyService) => () => config.getCompanyDetails(), deps: [CompanyService], multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimations(),
    provideAnimationsAsync(),
  ],
});
