import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceModalComponent } from './data-source-modal.component';

describe('DataSourceModalComponent', () => {
  let component: DataSourceModalComponent;
  let fixture: ComponentFixture<DataSourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSourceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataSourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
