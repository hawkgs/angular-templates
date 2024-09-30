import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTitleComponent } from './interactive-title.component';

describe('InteractiveTitleComponent', () => {
  let component: InteractiveTitleComponent;
  let fixture: ComponentFixture<InteractiveTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
