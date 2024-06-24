import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CategoryReelComponent } from './category-reel.component';
import { fetchMockApiProvider } from '../../../shared/fetch';
import { Category } from '../../../../models';

describe('CategoryReelComponent', () => {
  let component: CategoryReelComponent;
  let fixture: ComponentFixture<CategoryReelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryReelComponent],
      providers: [provideRouter([]), fetchMockApiProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryReelComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('category', new Category({}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
