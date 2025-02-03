import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDividendComponent } from './level-dividend.component';

describe('LevelDividendComponent', () => {
  let component: LevelDividendComponent;
  let fixture: ComponentFixture<LevelDividendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LevelDividendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDividendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
