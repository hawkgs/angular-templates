import { ComponentFixture, TestBed } from '@angular/core/testing';
import { windowProvider } from '@ngx-templates/shared/services';
import { provideRouter } from '@angular/router';

import { GalleryComponent } from './gallery.component';
import { fetchApiMock } from '../shared/utils/fetch-mock';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [provideRouter([]), fetchApiMock, windowProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
