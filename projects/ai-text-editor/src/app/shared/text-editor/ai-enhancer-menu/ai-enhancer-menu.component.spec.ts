import { ComponentFixture, TestBed } from '@angular/core/testing';
import { windowProvider } from '@ngx-templates/shared/services';

import { AiEnhancerMenuComponent } from './ai-enhancer-menu.component';
import { SelectionManager } from '../selection-manager.service';
import { providerGeminiApiMock } from '../../../gemini/gemini-api.provider';

describe('AiEnhancerMenuComponent', () => {
  let component: AiEnhancerMenuComponent;
  let fixture: ComponentFixture<AiEnhancerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiEnhancerMenuComponent],
      providers: [windowProvider, providerGeminiApiMock(), SelectionManager],
    }).compileComponents();

    fixture = TestBed.createComponent(AiEnhancerMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('position', { x: 0, y: 0 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
