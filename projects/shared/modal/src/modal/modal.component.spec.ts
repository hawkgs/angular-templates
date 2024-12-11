import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { List } from 'immutable';

import { ModalComponent } from './modal.component';
import { ModalController } from '../modal.controller';
import { Modal } from '../types';

@Component({
  selector: 'ngx-dummy',
  template: '',
})
export class DummyComponent {}

describe('ModalComponent', () => {
  let component: ModalComponent<unknown, unknown>;
  let fixture: ComponentFixture<ModalComponent<unknown, unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('modal', {
      id: '',
      component: DummyComponent,
      controller: new ModalController<void>(
        0,
        signal<List<Modal<unknown, unknown>>>(List([])),
      ),
      config: {},
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
