import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { CategoryPickerComponent } from './category-picker.component';
import { CategoriesService } from '../../../data-access/categories.service';
import { fetchMockApiProvider } from '../../../shared/fetch';
import { provideRouter } from '@angular/router';

describe('CategoryPickerComponent', () => {
  let component: CategoryPickerComponent;
  let componentRef: ComponentRef<CategoryPickerComponent>;
  let fixture: ComponentFixture<CategoryPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPickerComponent],
      providers: [provideRouter([]), fetchMockApiProvider, CategoriesService],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPickerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('categoryId', 'tech');
    componentRef.setInput('defaultCategoryName', 'Tech');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
