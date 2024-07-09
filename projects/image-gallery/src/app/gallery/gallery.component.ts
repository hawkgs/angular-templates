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
import { ImagesService } from './shared/images.service';

@Component({
  selector: 'ig-gallery',
  standalone: true,
  imports: [ImageMasonryComponent, InfiniteScrollComponent],
  providers: [ImagesService],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  images = inject(ImagesService);

  private _modals = inject(ModalService);
  private _route = inject(ActivatedRoute);
  private _location = inject(Location);

  async ngOnInit() {
    await this.images.loadImages();

    const idx = parseInt(this._route.snapshot.paramMap.get('idx') || '', 10);

    if (!isNaN(idx) && idx < this.images.totalSize()) {
      this._openImage(idx);
    }
  }

  onImageClick(e: { index: number }) {
    this._location.go('img/' + e.index);
    this._openImage(e.index);
  }

  async onNextPage(loadCompleted: () => void) {
    await this.images.loadImages();
    loadCompleted();
  }

  private _openImage(imageIdx: number) {
    this._modals
      .createModal<ImagePreviewData>(
        ImagePreviewComponent,
        { imageIdx, imagesService: this.images },
        {
          modalWindowUi: false,
        },
      )
      .closed.then(() => {
        this._location.go('/');
      });
  }
}
