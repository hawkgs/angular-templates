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
      () => this._doc.createElement('b'),
      (el: HTMLElement) => el.tagName === 'B',
    );
  }

  makeItalics() {
    this._formatSelection(
      () => this._doc.createElement('em'),
      (el: HTMLElement) => el.tagName === 'EM',
    );
  }

  makeUnderlined() {
    // Note(Georgi): Deprecated
    this._formatSelection(
      () => this._doc.createElement('u'),
      (el: HTMLElement) => el.tagName === 'U',
    );
  }

  changeTextStyle(style: TextStyle) {
    switch (style) {
      case 'heading':
        this._formatSelection(
          () => this._doc.createElement('h3'),
          (el: HTMLElement) => el.tagName === 'H3',
        );
        break;

      case 'monospaced':
        this._formatSelection(
          () => this._doc.createElement('pre'),
          (el: HTMLElement) => el.tagName === 'PRE',
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
            () => {
              const anchor = this._doc.createElement('a');
              anchor.href = url;
              return anchor;
            },
            (el: HTMLElement) => el.tagName === 'A',
          );
        }

        this._selection.unmemoize();
      });
  }

  private _formatSelection(
    formattedElementFactory: () => HTMLElement,
    formattedElementTest: (el: HTMLElement) => boolean,
  ) {
    this._selection.updateNode((range) => {
      // Note(Georgi): Not finalized
      const text = this._selection.text();
      const { startContainer, endContainer } = range;

      const isSameParent =
        startContainer.parentElement === endContainer.parentElement;
      const isSameData =
        startContainer.textContent === endContainer.textContent;
      const isFullOffset =
        range.startOffset === 0 && range.endOffset === text.length;
      const isParentElementFormatted = formattedElementTest(
        startContainer.parentElement!,
      );
      const isFormatted =
        isSameParent && isSameData && isFullOffset && isParentElementFormatted;

      if (!isFormatted) {
        const formattedEl = formattedElementFactory();
        formattedEl.innerText = text;
        return formattedEl;
      }

      startContainer.parentElement?.remove();
      return this._doc.createTextNode(text);
    });
  }
}
