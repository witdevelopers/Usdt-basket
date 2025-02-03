import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoiDividendComponent } from './roi-dividend.component';

describe('RoiDividendComponent', () => {
  let component: RoiDividendComponent;
  let fixture: ComponentFixture<RoiDividendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoiDividendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoiDividendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
