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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
