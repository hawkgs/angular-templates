import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelManagerComponent } from './label-manager.component';

describe('LabelManagerComponent', () => {
  let component: LabelManagerComponent;
  let fixture: ComponentFixture<LabelManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
