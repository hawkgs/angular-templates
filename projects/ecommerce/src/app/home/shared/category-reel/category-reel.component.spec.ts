import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CategoryReelComponent } from './category-reel.component';
import { fetchMockApiProvider } from '../../../shared/fetch';
import { input } from '@angular/core';
import { Category } from '../../../../models';

describe('CategoryReelComponent', () => {
  let component: CategoryReelComponent;
  let fixture: ComponentFixture<CategoryReelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryReelComponent, RouterTestingModule],
      providers: [fetchMockApiProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryReelComponent);
    component = fixture.componentInstance;
    component.category = input(new Category({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
