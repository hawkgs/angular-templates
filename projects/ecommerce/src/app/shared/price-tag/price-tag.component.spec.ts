import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceTagComponent } from './price-tag.component';

describe('PriceTagComponent', () => {
  let component: PriceTagComponent;
  let fixture: ComponentFixture<PriceTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PriceTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
