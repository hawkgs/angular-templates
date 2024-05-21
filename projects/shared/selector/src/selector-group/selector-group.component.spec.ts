import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorGroupComponent } from './selector-group.component';

describe('SelectorGroupComponent', () => {
  let component: SelectorGroupComponent;
  let fixture: ComponentFixture<SelectorGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
