import { inject, Injectable } from '@angular/core';
import { SelectionManager } from './selection-manager.service';
import { DOCUMENT } from '@angular/common';
import { ModalService } from '@ngx-templates/shared/modal';
import { HyperlinkModalComponent } from './hyperlink-modal/hyperlink-modal.component';

export type TextStyle = 'heading' | 'monospaced' | 'body';

// Note(Georgi): Under development
@Injectable()
export class FormattingService {
  private _selection = inject(SelectionManager);
  private _doc = inject(DOCUMENT);
  private _modals = inject(ModalService);

  makeBold() {
    this._formatSelection(
      (fmtEl: HTMLElement) => fmtEl.classList.add('bd'),
      (fmtEl: HTMLElement) => fmtEl.classList.remove('bd'),
      (fmtEl: HTMLElement) => fmtEl.classList.contains('bd'),
    );
  }

  makeItalic() {
    this._formatSelection(
      (fmtEl: HTMLElement) => fmtEl.classList.add('it'),
      (fmtEl: HTMLElement) => fmtEl.classList.remove('it'),
      (fmtEl: HTMLElement) => fmtEl.classList.contains('it'),
    );
  }

  makeUnderlined() {
    this._formatSelection(
      (fmtEl: HTMLElement) => fmtEl.classList.add('ul'),
      (fmtEl: HTMLElement) => fmtEl.classList.remove('ul'),
      (fmtEl: HTMLElement) => fmtEl.classList.contains('ul'),
    );
  }

  changeTextStyle(style: TextStyle) {
    switch (style) {
      case 'heading':
        this._formatSelection(
          (fmtEl: HTMLElement) => {
            fmtEl.classList.remove('mono');
            fmtEl.classList.add('hd');
          },
          () => {},
          (fmtEl: HTMLElement) => fmtEl.classList.contains('hd'),
        );
        break;

      case 'monospaced':
        this._formatSelection(
          (fmtEl: HTMLElement) => {
            fmtEl.classList.add('mono');
          },
          () => {},
          (fmtEl: HTMLElement) => fmtEl.classList.contains('mono'),
        );
        break;

      case 'body':
        this._formatSelection(
          (fmtEl) => fmtEl.classList.remove('hd', 'mono'),
          () => {},
          () => false,
        );
        break;
    }
  }

  addHyperlink() {
    this._selection.memoize();

    return this._modals
      .createModal<void, string>(HyperlinkModalComponent)
      .closed.then((url: string | undefined) => {
        if (url && url.length) {
          this._formatSelection(
            (fmtEl: HTMLElement) => {
              const anchor = this._doc.createElement('a');
              anchor.href = url;
              anchor.innerHTML = fmtEl.innerText;
              fmtEl.innerHTML = '';
              fmtEl.appendChild(anchor);

              fmtEl.classList.add('ach');
            },
            (fmtEl: HTMLElement) => {
              fmtEl.innerHTML = fmtEl.innerText;
            },
            (fmtEl: HTMLElement) => fmtEl.classList.contains('ach'),
          );
        }

        this._selection.unmemoize();
      });
  }

  private _formatSelection(
    formatElement: (el: HTMLElement) => void,
    unformatElement: (el: HTMLElement) => void,
    formattedElementTest: (el: HTMLElement) => boolean,
  ) {
    const range = this._selection.range();
    if (!range) {
      return;
    }

    const text = this._selection.text();
    const { startContainer, endContainer } = range;

    let fmtElement = startContainer.parentElement!;

    if (!startContainer.parentElement?.classList.contains('fmt')) {
      fmtElement = this._doc.createElement('span');
      fmtElement.classList.add('fmt');
      fmtElement.setAttribute('data-id', Date.now().toString());
      fmtElement.innerText = text;

      this._selection.updateNode(fmtElement);
    }

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

    if (!isFormatted) {
      formatElement(fmtElement);
    } else {
      unformatElement(fmtElement);
    }
  }
}
