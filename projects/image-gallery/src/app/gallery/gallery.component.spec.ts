import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { windowProvider } from '@ngx-templates/shared/services';
import { provideRouter } from '@angular/router';

import { GalleryComponent } from './gallery.component';
import { imgGalleryRequestResponseMock } from '../shared/utils/img-gallery-request-response-mock';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent],
      providers: [
        provideRouter([]),
        provideFetchApi(fetchMock(imgGalleryRequestResponseMock)),
        windowProvider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
