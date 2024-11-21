import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { CtxMenuComponent } from './ctx-menu.component';
import { CtxMenuController } from '../ctx-menu.controller';

@Component({
  selector: 'ngx-dummy',
  template: '',
})
export class DummyComponent {}

describe('CtxMenuComponent', () => {
  let component: CtxMenuComponent<unknown, unknown>;
  let fixture: ComponentFixture<CtxMenuComponent<unknown, unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtxMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CtxMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('menu', {
      component: DummyComponent,
      controller: new CtxMenuController<void>(signal(null)),
      coor: { x: 0, y: 0 },
      config: {},
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
