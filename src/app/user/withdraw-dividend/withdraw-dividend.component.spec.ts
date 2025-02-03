import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawDividendComponent } from './withdraw-dividend.component';

describe('WithdrawDividendComponent', () => {
  let component: WithdrawDividendComponent;
  let fixture: ComponentFixture<WithdrawDividendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawDividendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawDividendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
