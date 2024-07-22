import { DOCUMENT } from '@angular/common';
import { WINDOW } from '@ngx-templates/shared/services';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { DocStoreService } from './doc-store.service';
import { SafeHtmlPipe } from '../pipes/safe-html.pipe';
import { ModalService } from '@ngx-templates/shared/modal';
import { ConfirmClearModalComponent } from './confirm-clear-modal/confirm-clear-modal.component';
import { AiEnhancerMenuComponent } from './ai-enhancer-menu/ai-enhancer-menu.component';
import { SelectionManager } from './selection-manager.service';

const INPUT_DEBOUNCE = 2000;
const SAVED_LABEL_TTL = 1500;
const AI_ENHC_SELECTION_MARGIN = 10;
const MIN_AI_ENHC_STR_LEN = 5;

type Coor = { x: number; y: number };

@Component({
  selector: 'ate-text-editor',
  standalone: true,
  imports: [SafeHtmlPipe, AiEnhancerMenuComponent],
  providers: [DocStoreService, SelectionManager],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements AfterViewInit {
  private _win = inject(WINDOW);
  private _doc = inject(DOCUMENT);
  private _modal = inject(ModalService);
  private _selection = inject(SelectionManager);
  docStore = inject(DocStoreService);

  private _inputTo!: ReturnType<typeof setTimeout>;
  private _selectionInProgress = false;

  editor = viewChild.required<ElementRef>('editor');
  showSavedLabel = signal<boolean>(false);
  showAiEnhancer = signal<boolean>(false);
  aiEnhancerPos = signal<Coor>({ x: 0, y: 0 });

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

  clearDocument() {
    this._modal
      .createModal<void, boolean>(ConfirmClearModalComponent)
      .closed.then((shouldClear: boolean | undefined) => {
        if (shouldClear) {
          this.docStore.clearContent();
        }
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
