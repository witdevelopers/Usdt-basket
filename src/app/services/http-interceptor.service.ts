import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private loaderService: LoaderService,
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const loaderSubscription: Subscription =
      this.loaderService.loader$.subscribe();
    const token = sessionStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log("HttpResponse Success");
          loaderSubscription.unsubscribe();
        }
      }),
      catchError((err: any) => {
        loaderSubscription.unsubscribe();
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 400) {
            let msg = '';
            let cnt = 1;
            let errors = err.error.errors;
            for (let d in errors) {
              msg += cnt + '. ' + d + ': ' + errors[d] + '<br>';
              cnt++;
            }
            console.log(msg);
            Swal.fire({
              icon: 'error',
              title: 'Invalid request!',
              text: msg,
            });
          }
          if (err.status === 401) {
            Swal.fire({
              icon: 'error',
              text: 'Session expired. Please login again!',
            }).then((res) => {
              this.router.navigate(['auth/login']);
            });
          }
          if (err.status === 403) {
            Swal.fire({
              icon: 'error',
              text: 'You are not allowed!',
            }).then((res) => {
              this.router.navigate(['auth/login']);
            });
          }
          if (err.status === 500) {
            Swal.fire({
              icon: 'error',
              text: 'Some server error occurred, please try after some time!',
            });
          }
          if (err.status === 0) {
            Swal.fire({
              icon: 'error',
              text: "Can't reach server. Please try after some time!",
            });
          }
          if (err.error instanceof Error) {
          }
        }
        return throwError(() => new HttpErrorResponse(err));
      }),
    );
  }
}
