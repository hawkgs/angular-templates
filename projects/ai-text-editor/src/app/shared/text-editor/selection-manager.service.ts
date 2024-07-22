import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { WINDOW } from '@ngx-templates/shared/services';

@Injectable()
export class SelectionManager {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);

  private get _selection() {
    return this._win.getSelection();
  }

  text(): string {
    return (this._selection?.toString() || '').trim();
  }

  position(): { x: number; y: number } {
    const range = this._selection?.getRangeAt(0);

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
    const range = this._selection?.getRangeAt(0);

    if (!range) {
      return;
    }

    const node = updater(range);
    range.deleteContents();
    range.insertNode(node);
  }
}
