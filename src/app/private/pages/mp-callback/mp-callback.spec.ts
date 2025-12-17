import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpCallback } from './mp-callback';

describe('MpCallback', () => {
  let component: MpCallback;
  let fixture: ComponentFixture<MpCallback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpCallback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpCallback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
