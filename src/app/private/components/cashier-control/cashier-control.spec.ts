import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierControl } from './cashier-control';

describe('CashierControl', () => {
  let component: CashierControl;
  let fixture: ComponentFixture<CashierControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
