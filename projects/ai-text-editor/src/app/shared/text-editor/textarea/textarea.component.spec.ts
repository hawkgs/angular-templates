import { ComponentFixture, TestBed } from '@angular/core/testing';
import { windowProvider } from '@ngx-templates/shared/services';

import { TextareaComponent } from './textarea.component';
import { SelectionManager } from '../selection-manager.service';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaComponent],
      providers: [windowProvider, SelectionManager],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
