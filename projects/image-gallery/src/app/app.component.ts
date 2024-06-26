import { Component, inject, signal } from '@angular/core';
import { List } from 'immutable';
import {
  ModalOutletComponent,
  ModalService,
} from '@ngx-templates/shared/modal';

import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ImageGridComponent } from './shared/image-grid/image-grid.component';
import { IMAGES } from './shared/images';
import { ImageConfig } from './shared/types';
import {
  ImagePreviewComponent,
  ImagePreviewData,
} from './shared/image-preview/image-preview.component';

const IMG_CFGS = IMAGES.map((ar, i) => ({
  src: 'test-image.jpg?id=' + i,
  aspectRatio: ar,
  idx: i,
  priority: i <= 12,
}));

@Component({
  selector: 'ig-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ImageGridComponent,
    ModalOutletComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _modals = inject(ModalService);

  images = signal<List<ImageConfig>>(List(IMG_CFGS));

  onImageClick(cfg: ImageConfig) {
    const imageIdx = this.images().findIndex((c) => c === cfg);
    this._modals.createModal<ImagePreviewData>(
      ImagePreviewComponent,
      { imageIdx, images: this.images.asReadonly() },
      {
        modalWindowUi: false,
      },
    );
  }
}
