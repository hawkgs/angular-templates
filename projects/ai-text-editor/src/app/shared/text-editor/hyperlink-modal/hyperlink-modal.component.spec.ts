import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperlinkModalComponent } from './hyperlink-modal.component';

describe('HyperlinkModalComponent', () => {
  let component: HyperlinkModalComponent;
  let fixture: ComponentFixture<HyperlinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperlinkModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HyperlinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
