import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@ngx-templates/shared/services';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { DocStoreService } from './doc-store.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ModalService } from '@ngx-templates/shared/modal';
import { ConfirmClearModalComponent } from './confirm-clear-modal/confirm-clear-modal.component';

const INPUT_DEBOUNCE = 2000;
const SAVED_LABEL_TTL = 1500;

@Component({
  selector: 'ate-text-editor',
  standalone: true,
  imports: [SafeHtmlPipe],
  providers: [DocStoreService],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);
  private _modal = inject(ModalService);
  docStore = inject(DocStoreService);

  private _inputTo!: ReturnType<typeof setTimeout>;

  editor = viewChild.required<ElementRef>('editor');
  showSavedLabel = signal<boolean>(false);

  ngAfterViewInit() {
    this.docStore.provideTarget(this.editor().nativeElement);

    setTimeout(() => {
      this.editor().nativeElement.focus();
    });
  }

  bold() {
    this._formatSelection(
      () => this._doc.createElement('b'),
      (el: HTMLElement) => el.tagName === 'B',
    );
    this.onInput();
  }

  italics() {
    this._formatSelection(
      () => this._doc.createElement('em'),
      (el: HTMLElement) => el.tagName === 'EM',
    );
    this.onInput();
  }

  onInput() {
    if (this._inputTo) {
      clearTimeout(this._inputTo);
    }

    this._inputTo = setTimeout(() => {
      this.docStore.save();

      this.showSavedLabel.set(true);
      setTimeout(() => this.showSavedLabel.set(false), SAVED_LABEL_TTL);
    }, INPUT_DEBOUNCE);
  }

  clearDocument() {
    this._modal
      .createModal<void, boolean>(ConfirmClearModalComponent)
      .closed.then((shouldClear: boolean | undefined) => {
        if (shouldClear) {
          this.docStore.clearContent();
        }
      });
  }

  // Note(Georgi): Not finalized
  private _formatSelection(
    formattedElementFactory: () => HTMLElement,
    formattedElementTest: (el: HTMLElement) => boolean,
  ) {
    const selection = this._win.getSelection();
    const range = selection?.getRangeAt(0);

    if (!selection || !range) {
      return;
    }

    const text = selection.toString();

    const { startContainer, endContainer } = range;
    const isSameParent =
      startContainer.parentElement === endContainer.parentElement;
    const isSameData = startContainer.textContent === endContainer.textContent;
    const isFullOffset =
      range.startOffset === 0 && range.endOffset === text.length;
    const isParentElementFormatted = formattedElementTest(
      startContainer.parentElement!,
    );
    const isFormatted =
      isSameParent && isSameData && isFullOffset && isParentElementFormatted;

    let newNode: Node;

    if (!isFormatted) {
      const formattedEl = formattedElementFactory();
      formattedEl.innerText = text;
      newNode = formattedEl;
    } else {
      newNode = this._doc.createTextNode(text);
      startContainer.parentElement?.remove();
    }

    range.deleteContents();
    range.insertNode(newNode);
  }
}
