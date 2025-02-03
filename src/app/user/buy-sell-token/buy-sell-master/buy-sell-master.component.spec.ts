import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellMasterComponent } from './buy-sell-master.component';

describe('BuySellMasterComponent', () => {
  let component: BuySellMasterComponent;
  let fixture: ComponentFixture<BuySellMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuySellMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySellMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
