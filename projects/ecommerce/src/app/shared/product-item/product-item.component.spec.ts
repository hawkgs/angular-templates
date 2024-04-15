import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductItemComponent } from './product-item.component';
import { CategoriesService } from '../../data-access/categories.service';
import { fetchMockApiProvider } from '../fetch';
import { input } from '@angular/core';
import { Product } from '../../../models';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItemComponent, RouterTestingModule],
      providers: [fetchMockApiProvider, CategoriesService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    component.product = input(new Product({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
