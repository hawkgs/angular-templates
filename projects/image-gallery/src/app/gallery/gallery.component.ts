import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModalService } from '@ngx-templates/shared/modal';
import { InfiniteScrollComponent } from '@ngx-templates/shared/infinite-scroll';

import { ImageMasonryComponent } from './shared/image-masonry/image-masonry.component';
import {
  ImagePreviewComponent,
  ImagePreviewData,
} from './shared/image-preview/image-preview.component';
import { ImagesService } from '../shared/images.service';

@Component({
  selector: 'ig-gallery',
  standalone: true,
  imports: [ImageMasonryComponent, InfiniteScrollComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  images = inject(ImagesService);

  private _modals = inject(ModalService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);

  constructor() {
    const id = this._route.snapshot.paramMap.get('id');

    if (id && this.images.value().get(id)) {
      this._openImage(id);
    }
  }

  ngOnInit() {
    this.images.loadImages();
  }

  onImageClick(e: { id: string }) {
    this._location.go('img/' + e.id);
    this._openImage(e.id);
  }

  async onNextPage(loadCompleted: () => void) {
    await this.images.loadImages();
    loadCompleted();
  }

  private _openImage(imageId: string) {
    this._modals
      .createModal<ImagePreviewData>(
        ImagePreviewComponent,
        {
          imageId,
        },
        {
          modalWindowUi: false,
        },
      )
      .closed.then(() => {
        this._location.go('/');
      });
  }
}
