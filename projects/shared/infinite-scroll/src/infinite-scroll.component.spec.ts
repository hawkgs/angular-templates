import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideWindow } from '@ngx-templates/shared/services';

import { InfiniteScrollComponent } from './infinite-scroll.component';

describe('InfiniteLoadingComponent', () => {
  let component: InfiniteScrollComponent;
  let fixture: ComponentFixture<InfiniteScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollComponent],
      providers: [provideWindow()],
    }).compileComponents();

    fixture = TestBed.createComponent(InfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
