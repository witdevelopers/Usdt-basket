import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, defer, finalize, NEVER, share } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private spinner: NgxSpinnerService) {}

  public show(): void {
    this.isLoadingSubject.next(true); // Emit true to show the loader
    this.spinner.show(); // Show the spinner
  }
  public hide(): void {
    this.isLoadingSubject.next(false); // Emit false to hide the loader
    this.spinner.hide(); // Hide the spinner
  }
  public readonly loader$ = defer(() => {
    this.show(); // Show the loader when observable is triggered
    return NEVER.pipe(
      finalize(() => {
        this.hide(); // Hide the loader after the observable completes
      }),
    );
  }).pipe(share());
}
