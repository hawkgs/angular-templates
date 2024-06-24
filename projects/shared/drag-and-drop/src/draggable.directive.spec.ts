import { TestBed } from '@angular/core/testing';
import { DraggableDirective } from './draggable.directive';
import { Renderer2, TemplateRef } from '@angular/core';
import { windowProvider } from '@ngx-templates/shared/services';

describe('DraggableDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TemplateRef, Renderer2, windowProvider],
    }).compileComponents();
  });

  it('should create an instance', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new DraggableDirective();
      expect(directive).toBeTruthy();
    });
  });
});
