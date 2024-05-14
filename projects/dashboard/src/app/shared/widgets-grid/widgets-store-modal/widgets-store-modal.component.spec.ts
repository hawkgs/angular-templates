import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsStoreModalComponent } from './widgets-store-modal.component';

describe('WidgetsStoreModalComponent', () => {
  let component: WidgetsStoreModalComponent;
  let fixture: ComponentFixture<WidgetsStoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsStoreModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetsStoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
