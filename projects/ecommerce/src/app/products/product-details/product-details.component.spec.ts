import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';

import { ProductDetailsComponent } from './product-details.component';
import { ProductsService } from '../../data-access/products.service';
import { fetchMockApiProvider } from '../../shared/fetch';
import { CategoriesService } from '../../data-access/categories.service';
import { windowProvider } from '@ngx-templates/shared/services';
import { CartService } from '../../data-access/cart.service';
import { Product } from '../../../models';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent, RouterTestingModule],
      providers: [
        windowProvider,
        fetchMockApiProvider,
        ProductsService,
        CategoriesService,
        CartService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    component.product = signal(new Product({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
