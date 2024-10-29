import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtxMenuOutletComponent } from './ctx-menu-outlet.component';

describe('CtxMenuOutletComponent', () => {
  let component: CtxMenuOutletComponent;
  let fixture: ComponentFixture<CtxMenuOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtxMenuOutletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CtxMenuOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
