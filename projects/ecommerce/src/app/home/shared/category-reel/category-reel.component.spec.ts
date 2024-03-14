import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryReelComponent } from './category-reel.component';

describe('CategoryReelComponent', () => {
  let component: CategoryReelComponent;
  let fixture: ComponentFixture<CategoryReelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryReelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryReelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
