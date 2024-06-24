import { ComponentFixture, TestBed } from '@angular/core/testing';
import { windowProvider } from '@ngx-templates/shared/services';
import { WidgetsGridComponent } from './widgets-grid.component';
import { provideDataSources } from '../../data/utils';

describe('WidgetsGridComponent', () => {
  let component: WidgetsGridComponent;
  let fixture: ComponentFixture<WidgetsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetsGridComponent],
      providers: [windowProvider, provideDataSources()],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
