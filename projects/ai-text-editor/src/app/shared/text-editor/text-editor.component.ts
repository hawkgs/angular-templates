import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ModalService } from '@ngx-templates/shared/modal';

import { DocStoreService } from './doc-store.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ConfirmClearModalComponent } from './confirm-clear-modal/confirm-clear-modal.component';
import { AiEnhancerMenuComponent } from './ai-enhancer-menu/ai-enhancer-menu.component';
import { SelectionManager } from './selection-manager.service';
import { FormattingService } from './formatting.service';
import {
  FormatCommandType,
  FormattingBarComponent,
} from './formatting-bar/formatting-bar.component';

const INPUT_DEBOUNCE = 2000;
const SAVED_LABEL_TTL = 1500;
const AI_ENHC_SELECTION_MARGIN = 10;
const MIN_AI_ENHC_STR_LEN = 5;

@Component({
  selector: 'ate-text-editor',
  standalone: true,
  imports: [SafeHtmlPipe, AiEnhancerMenuComponent, FormattingBarComponent],
  providers: [DocStoreService, SelectionManager, FormattingService],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit {
  private _modal = inject(ModalService);
  private _selection = inject(SelectionManager);
  private _formatting = inject(FormattingService);
  docStore = inject(DocStoreService);

  private _inputTo!: ReturnType<typeof setTimeout>;
  private _selectionInProgress = false;

  editor = viewChild.required<ElementRef>('editor');
  showSavedLabel = signal<boolean>(false);
  showAiEnhancer = signal<boolean>(false);
  aiEnhancerPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngAfterViewInit() {
    this.docStore.provideTarget(this.editor().nativeElement);

    setTimeout(() => {
      this.editor().nativeElement.focus();
    });
  }

  async onFormat(cmd: FormatCommandType) {
    switch (cmd) {
      case 'bold':
        this._formatting.makeBold();
        break;
      case 'italics':
        this._formatting.makeItalics();
        break;
      case 'underlined':
        this._formatting.makeUnderlined();
        break;
      case 'hyperlink':
        await this._formatting.addHyperlink();
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
    if (this._inputTo) {
      clearTimeout(this._inputTo);
    }

    this._inputTo = setTimeout(() => {
      this.docStore.save();

      this.showSavedLabel.set(true);
      setTimeout(() => this.showSavedLabel.set(false), SAVED_LABEL_TTL);
    }, INPUT_DEBOUNCE);
  }

  onSelectStart() {
    this._selectionInProgress = true;
  }

  @HostListener('document:mouseup')
  @HostListener('document:keyup')
  @HostListener('document:touchend')
  onDocumentInteractionEnd() {
    if (
      this._selectionInProgress &&
      this._selection.text().length >= MIN_AI_ENHC_STR_LEN
    ) {
      const { x, y } = this._selection.position();

      this.showAiEnhancer.set(true);
      this.aiEnhancerPos.set({
        x: x + AI_ENHC_SELECTION_MARGIN,
        y: y + AI_ENHC_SELECTION_MARGIN,
      });
    } else {
      this.showAiEnhancer.set(false);
    }

    this._selectionInProgress = false;
  }

  onAiEnhancerInteractionEnd(e: Event) {
    e.stopPropagation();
  }
}
