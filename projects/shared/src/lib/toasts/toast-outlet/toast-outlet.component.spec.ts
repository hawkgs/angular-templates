import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastOutletComponent } from './toast-outlet.component';
import { ToastsService } from '../toasts.service';

describe('ToastOutletComponent', () => {
  let component: ToastOutletComponent;
  let fixture: ComponentFixture<ToastOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastOutletComponent],
      providers: [ToastsService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
