import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorItemComponent } from './selector-item.component';

describe('SelectorItemComponent', () => {
  let component: SelectorItemComponent;
  let fixture: ComponentFixture<SelectorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
