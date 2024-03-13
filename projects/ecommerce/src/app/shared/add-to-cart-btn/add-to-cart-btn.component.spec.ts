import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartBtnComponent } from './add-to-cart-btn.component';

describe('AddToCartBtnComponent', () => {
  let component: AddToCartBtnComponent;
  let fixture: ComponentFixture<AddToCartBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCartBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToCartBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
