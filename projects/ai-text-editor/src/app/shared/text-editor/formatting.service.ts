import { inject, Injectable } from '@angular/core';
import { SelectionManager } from './selection-manager.service';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class FormattingService {
  private _selection = inject(SelectionManager);
  private _doc = inject(DOCUMENT);

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
