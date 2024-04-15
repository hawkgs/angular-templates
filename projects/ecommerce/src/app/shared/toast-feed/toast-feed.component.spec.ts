import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastFeedComponent } from './toast-feed.component';
import { ToastsService } from './toasts.service';

describe('ToastFeedComponent', () => {
  let component: ToastFeedComponent;
  let fixture: ComponentFixture<ToastFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastFeedComponent],
      providers: [ToastsService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
