import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastFeedComponent } from './toast-feed.component';

describe('ToastFeedComponent', () => {
  let component: ToastFeedComponent;
  let fixture: ComponentFixture<ToastFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastFeedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
