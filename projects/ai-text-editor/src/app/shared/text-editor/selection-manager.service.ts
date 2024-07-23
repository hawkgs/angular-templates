import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@ngx-templates/shared/services';
import { EditorSelection } from './editor-selection';

@Injectable()
export class SelectionManager {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);
  private _selectionCache: EditorSelection | null = null;

  private get _selection(): EditorSelection {
    if (this._selectionCache) {
      return this._selectionCache;
    }
    return this._createEditorSelection();
  }

  text(): string {
    return this._selection.toString().trim();
  }

  position(): { x: number; y: number } {
    const range = this._selection.getRange();

    if (!range) {
      return { x: -1, y: -1 };
    }

    const rect = range.getBoundingClientRect();
    return {
      x: rect.x + rect.width,
      y: rect.y + rect.height,
    };
  }

  updateText(text: string) {
    this.updateNode(() => this._doc.createTextNode(text));
  }

  updateNode(updater: (r: Range) => Node) {
    const range = this._selection.getRange();

    if (!range) {
      return;
    }

    const node = updater(range);
    range.deleteContents();
    range.insertNode(node);
  }

  memoize() {
    this._selectionCache = this._createEditorSelection();
  }

  unmemoize() {
    this._selectionCache = null;
  }

  private _createEditorSelection() {
    const selection = this._win.getSelection();

    return new EditorSelection(
      selection?.getRangeAt(0),
      selection?.toString() || '',
    );
  }
}
