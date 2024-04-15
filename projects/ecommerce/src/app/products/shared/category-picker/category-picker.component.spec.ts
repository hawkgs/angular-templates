import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { input } from '@angular/core';

import { CategoryPickerComponent } from './category-picker.component';
import { CategoriesService } from '../../../data-access/categories.service';
import { fetchMockApiProvider } from '../../../shared/fetch';

describe('CategoryPickerComponent', () => {
  let component: CategoryPickerComponent;
  let fixture: ComponentFixture<CategoryPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPickerComponent, RouterTestingModule],
      providers: [fetchMockApiProvider, CategoriesService],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPickerComponent);
    component = fixture.componentInstance;
    component.categoryId = input('tech');
    component.defaultCategoryName = input('Tech');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
