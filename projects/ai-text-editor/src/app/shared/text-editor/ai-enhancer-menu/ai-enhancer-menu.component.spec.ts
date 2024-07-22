import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiEnhancerMenuComponent } from './ai-enhancer-menu.component';

describe('AiEnhancerMenuComponent', () => {
  let component: AiEnhancerMenuComponent;
  let fixture: ComponentFixture<AiEnhancerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiEnhancerMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiEnhancerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
