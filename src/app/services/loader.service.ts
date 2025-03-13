import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, defer, finalize, timer, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private spinner: NgxSpinnerService) {}

  public show(): void {
    if (!this.isLoadingSubject.getValue()) {
      this.isLoadingSubject.next(true);
      this.spinner.show();
    }
  }

  public hide(): void {
    if (this.isLoadingSubject.getValue()) {
      this.isLoadingSubject.next(false);
      this.spinner.hide();
    }
  }

  /**
   * Auto-hides after a given duration (e.g., 5 seconds)
   */
  public readonly loader$ = defer(() => {
    this.show();
    return timer(5000).pipe(
      finalize(() => {
        this.hide();
      })
    );
  }).pipe(share());

  /**
   * Show spinner when a wallet transaction starts and hide when it ends
   */
  public async trackWalletTransaction(txPromise: Promise<any>): Promise<any> {
    this.show(); // Show the loader when transaction starts
    try {
      const result = await txPromise;
      return result;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      this.hide(); // Hide the loader after transaction completes
    }
  }
}
