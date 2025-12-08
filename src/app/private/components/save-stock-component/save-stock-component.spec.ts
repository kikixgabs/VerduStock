import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveStockComponent } from './save-stock-component';

describe('SaveStockComponent', () => {
  let component: SaveStockComponent;
  let fixture: ComponentFixture<SaveStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
