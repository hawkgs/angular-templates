import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLogoComponent } from './app-logo.component';

describe('AppLogoComponent', () => {
  let component: AppLogoComponent;
  let fixture: ComponentFixture<AppLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
