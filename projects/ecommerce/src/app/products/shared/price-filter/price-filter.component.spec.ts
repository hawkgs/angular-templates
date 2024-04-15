import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFilterComponent } from './price-filter.component';
import { input } from '@angular/core';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceFilterComponent);
    component = fixture.componentInstance;
    component.default = input({ from: 0, to: 1000 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
