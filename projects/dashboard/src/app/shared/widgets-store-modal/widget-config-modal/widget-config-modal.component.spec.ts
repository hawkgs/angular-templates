import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetConfigModalComponent } from './widget-config-modal.component';

describe('WidgetConfigModalComponent', () => {
  let component: WidgetConfigModalComponent;
  let fixture: ComponentFixture<WidgetConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetConfigModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
