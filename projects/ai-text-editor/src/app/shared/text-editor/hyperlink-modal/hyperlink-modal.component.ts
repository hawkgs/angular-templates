import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ModalContentComponent,
  ModalController,
} from '@ngx-templates/shared/modal';
import { ButtonComponent } from '@ngx-templates/shared/button';
import { urlValidator } from './url.validator';

@Component({
  selector: 'ate-hyperlink-modal',
  standalone: true,
  imports: [ModalContentComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './hyperlink-modal.component.html',
  styleUrl: './hyperlink-modal.component.scss',
})
export class HyperlinkModalComponent {
  ctrl: ModalController<string> = inject(ModalController);

  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    url: ['', [Validators.required, urlValidator]],
  });

  addLink() {
    let url = this.form.get('url')?.value || '';
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    this.ctrl.close(url);
  }
}
