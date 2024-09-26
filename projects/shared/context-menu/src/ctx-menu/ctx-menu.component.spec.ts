import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtxMenuComponent } from './ctx-menu.component';

describe('CtxMenuComponent', () => {
  let component: CtxMenuComponent;
  let fixture: ComponentFixture<CtxMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtxMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
