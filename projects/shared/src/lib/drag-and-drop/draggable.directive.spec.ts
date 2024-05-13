import { TestBed } from '@angular/core/testing';
import { DraggableDirective } from './draggable.directive';
import { Renderer2, TemplateRef } from '@angular/core';

describe('DraggableDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TemplateRef, Renderer2],
    }).compileComponents();
  });

  it('should create an instance', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new DraggableDirective();
      expect(directive).toBeTruthy();
    });
  });
});
