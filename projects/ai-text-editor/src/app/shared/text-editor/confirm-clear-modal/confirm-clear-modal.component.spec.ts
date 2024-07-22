import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmClearModalComponent } from './confirm-clear-modal.component';

describe('ConfirmClearModalComponent', () => {
  let component: ConfirmClearModalComponent;
  let fixture: ComponentFixture<ConfirmClearModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmClearModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmClearModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
