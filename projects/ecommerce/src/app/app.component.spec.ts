import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CategoriesService } from './data-access/categories.service';
import { fetchMockApiProvider } from './shared/fetch';
import { CartService } from './data-access/cart.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [fetchMockApiProvider, CategoriesService, CartService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
