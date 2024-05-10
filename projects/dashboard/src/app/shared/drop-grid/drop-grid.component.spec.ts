import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropGridComponent } from './drop-grid.component';

describe('DropGridComponent', () => {
  let component: DropGridComponent;
  let fixture: ComponentFixture<DropGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
