import { Component, inject, signal } from '@angular/core';
import { ModalService } from '@ngx-templates/shared/modal';

import { DocStoreService } from './doc-store.service';
import { ConfirmClearModalComponent } from './confirm-clear-modal/confirm-clear-modal.component';
import { AiEnhancerMenuComponent } from './ai-enhancer-menu/ai-enhancer-menu.component';
import { SelectionManager } from './selection-manager.service';
import { FormattingService, TextStyle } from './formatting.service';
import {
  FormatEvent,
  FormattingBarComponent,
} from './formatting-bar/formatting-bar.component';
import { TextareaComponent } from './textarea/textarea.component';

const INPUT_DEBOUNCE = 2000;
const SAVED_LABEL_TTL = 1500;
const AI_ENHC_SELECTION_MARGIN = 10;
const MIN_AI_ENHC_STR_LEN = 5;

@Component({
  selector: 'ate-text-editor',
  standalone: true,
  imports: [TextareaComponent, AiEnhancerMenuComponent, FormattingBarComponent],
  providers: [DocStoreService, SelectionManager, FormattingService],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent {
  private _modal = inject(ModalService);
  private _selection = inject(SelectionManager);
  private _formatting = inject(FormattingService);
  docStore = inject(DocStoreService);

  private _inputTimeout!: ReturnType<typeof setTimeout>;

  isTextSelected = signal<boolean>(false);
  showSavedLabel = signal<boolean>(false);
  showAiEnhancer = signal<boolean>(false);
  aiEnhancerPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  async onFormat(e: FormatEvent) {
    switch (e.command) {
      case 'bold':
        this._formatting.makeBold();
        break;
      case 'italics':
        this._formatting.makeItalic();
        break;
      case 'underlined':
        this._formatting.makeUnderlined();
        break;
      case 'hyperlink':
        await this._formatting.addHyperlink();
        break;
      case 'text-style':
        this._formatting.changeTextStyle(e.parameter as TextStyle);
        break;
    }

    this.onInput();
  }

  clearDocument() {
    this._modal
      .createModal<void, boolean>(ConfirmClearModalComponent)
      .closed.then((shouldClear: boolean | undefined) => {
        if (shouldClear) {
          this.docStore.clear();
        }
      });
  }

  onInput() {
    if (this._inputTimeout) {
      clearTimeout(this._inputTimeout);
    }

    this._inputTimeout = setTimeout(() => {
      this.docStore.save();

      this.showSavedLabel.set(true);
      setTimeout(() => this.showSavedLabel.set(false), SAVED_LABEL_TTL);
    }, INPUT_DEBOUNCE);
  }

  onTextSelect(text: string) {
    if (text.length >= MIN_AI_ENHC_STR_LEN) {
      const { x, y } = this._selection.position();

      this.showAiEnhancer.set(true);
      this.aiEnhancerPos.set({
        x: x + AI_ENHC_SELECTION_MARGIN,
        y: y + AI_ENHC_SELECTION_MARGIN,
      });
    } else {
      this.showAiEnhancer.set(false);
    }

    this.isTextSelected.set(!!text.length);
  }

  onAiEnhance() {
    this.showAiEnhancer.set(false);
    this.onInput();
  }

  onAiEnhancerInteractionEnd(e: Event) {
    e.stopPropagation();
  }
}
