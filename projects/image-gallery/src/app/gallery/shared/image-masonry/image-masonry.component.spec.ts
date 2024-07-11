import { ComponentFixture, TestBed } from '@angular/core/testing';
import { windowProvider } from '@ngx-templates/shared/services';

import { ImageMasonryComponent } from './image-masonry.component';
import { List } from 'immutable';

describe('ImageMasonryComponent', () => {
  let component: ImageMasonryComponent;
  let fixture: ComponentFixture<ImageMasonryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageMasonryComponent],
      providers: [windowProvider],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageMasonryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', List([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
