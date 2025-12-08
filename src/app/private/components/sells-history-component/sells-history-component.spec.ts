import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellsHistoryComponent } from './sells-history-component';

describe('SellsHistoryComponent', () => {
  let component: SellsHistoryComponent;
  let fixture: ComponentFixture<SellsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellsHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
