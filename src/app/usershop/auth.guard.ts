import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.isUserAuthenticated();

    if (isAuthenticated) {
      return true; 
    }

    this.redirectToLogin(state.url);
    return false;
  }

  private isUserAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    return token !== null && token.trim() !== '';
  }
 
  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['login'], { queryParams: { returnUrl } });
  }
}
