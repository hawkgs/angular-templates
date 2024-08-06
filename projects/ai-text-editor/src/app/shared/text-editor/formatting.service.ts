import { inject, Injectable } from '@angular/core';
import { SelectionManager } from './selection-manager.service';
import { DOCUMENT } from '@angular/common';
import { ModalService } from '@ngx-templates/shared/modal';
import { HyperlinkModalComponent } from './hyperlink-modal/hyperlink-modal.component';

export type TextStyle = 'heading' | 'monospaced' | 'body';

const applyInlineFormatting = (fmtEl: HTMLElement, fmtClass: string) => {
  fmtEl.classList.add(fmtClass);
  fmtEl.classList.remove('x-' + fmtClass);
};

const removeInlineFormatting = (fmtEl: HTMLElement, fmtClass: string) => {
  fmtEl.classList.add('x-' + fmtClass);
  fmtEl.classList.remove(fmtClass);
};

// Note(Georgi): Under development
@Injectable()
export class FormattingService {
  private _selection = inject(SelectionManager);
  private _doc = inject(DOCUMENT);
  private _modals = inject(ModalService);

  makeBold() {
    this._formatSelection(
      (fmtEl) => applyInlineFormatting(fmtEl, 'bd'),
      (fmtEl) => removeInlineFormatting(fmtEl, 'bd'),
      (fmtEl) => fmtEl.classList.contains('bd'),
    );
  }

  makeItalic() {
    this._formatSelection(
      (fmtEl) => applyInlineFormatting(fmtEl, 'it'),
      (fmtEl) => removeInlineFormatting(fmtEl, 'it'),
      (fmtEl) => fmtEl.classList.contains('it'),
    );
  }

  makeUnderlined() {
    this._formatSelection(
      (fmtEl) => applyInlineFormatting(fmtEl, 'ul'),
      (fmtEl) => removeInlineFormatting(fmtEl, 'ul'),
      (fmtEl) => fmtEl.classList.contains('ul'),
    );
  }

  changeTextStyle(style: TextStyle) {
    switch (style) {
      case 'heading':
        this._formatSelection(
          (fmtEl) => {
            fmtEl.classList.remove('mono');
            fmtEl.classList.add('hd');
          },
          () => {},
          (fmtEl) => fmtEl.classList.contains('hd'),
        );
        break;

      case 'monospaced':
        this._formatSelection(
          (fmtEl) => {
            fmtEl.classList.add('mono');
          },
          () => {},
          (fmtEl) => fmtEl.classList.contains('mono'),
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
            (fmtEl) => {
              const anchor = this._doc.createElement('a');
              anchor.href = url;
              anchor.innerHTML = fmtEl.innerText;
              fmtEl.innerHTML = '';
              fmtEl.appendChild(anchor);

              fmtEl.classList.add('ach');
            },
            (fmtEl) => {
              fmtEl.innerHTML = fmtEl.innerText;
            },
            (fmtEl) => fmtEl.classList.contains('ach'),
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

    const isSameParent =
      startContainer.parentElement === endContainer.parentElement;
    const isSameData = startContainer.textContent === endContainer.textContent;
    const isFullOffset =
      range.startOffset === 0 && range.endOffset === text.length;
    const isFmtElement =
      startContainer.parentElement?.classList.contains('fmt');

    // Is current selection wrapper in a fmtElement from end to end
    const isWrapperInFmtElement =
      isSameParent && isSameData && isFullOffset && isFmtElement;

    let fmtElement = startContainer.parentElement!;

    // If not in fmtElement, wrap it
    if (!isWrapperInFmtElement) {
      fmtElement = this._doc.createElement('span');
      fmtElement.classList.add('fmt');
      fmtElement.setAttribute('data-id', Date.now().toString());
      fmtElement.innerText = text;

      this._selection.updateNode(fmtElement);
    }

    // Apply or remove formatting
    if (!formattedElementTest(fmtElement)) {
      formatElement(fmtElement);
    } else {
      unformatElement(fmtElement);
    }
  }
}
