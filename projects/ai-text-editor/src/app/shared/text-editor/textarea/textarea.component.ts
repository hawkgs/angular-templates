import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SelectionManager } from '../selection-manager.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

export class TextareaController {
  constructor(private _textarea: TextareaComponent) {}

  clear() {
    if (this._textarea.contents()) {
      this._textarea.contents.set('');
    } else {
      // Special case – if the content is empty (e.g. typing in in a new doc),
      // setting it again to an empty string will not clear the textarea (no change).
      // That's why, we have to do this manually.
      this._textarea.editor().nativeElement.innerHTML = '';
    }
  }
}

@Component({
  selector: 'ate-textarea',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements AfterViewInit {
  private _selection = inject(SelectionManager);

  private _contentsInit: boolean = false;
  private _focused: boolean = false;
  private _mouseLock: boolean = false;
  private _storedSelection = '';
  private _lastSelection = '';

  editor = viewChild.required<ElementRef>('editor');

  /**
   * Provide the parent editor wrapper element.
   * Default: Direct parent.
   */
  parent = input<HTMLElement | null>(null);

  textSelect = output<string>();
  input = output<string>();
  ref = output<HTMLElement>();
  ctrl = output<TextareaController>();

  contents = signal<string>('');

  /**
   * Textarea initial contents.
   */
  // We don't want to update unnecessarily the textarea
  // on each contents signal update. This is why we are
  // guarding against it.
  @Input()
  set initContents(v: string) {
    if (!this._contentsInit) {
      this.contents.set(v);
      this._contentsInit = true;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.editor().nativeElement.focus();
    });

    this.ref.emit(this.editor().nativeElement);
    this.ctrl.emit(new TextareaController(this));
  }

  onFocus() {
    this._focused = true;
  }

  onBlur() {
    this._focused = false;
  }

  @HostListener('document:mousedown')
  onDocumentMousedown() {
    this._mouseLock = true;
  }

  @HostListener('document:mouseup')
  onDocumentMouseup() {
    this._mouseLock = false;

    if (this._storedSelection) {
      this.textSelect.emit(this._storedSelection);
      this._storedSelection = '';
    }
  }

  @HostListener('document:selectionchange')
  onDocumentSelectionChange() {
    if (!this._focused) {
      return;
    }

    const selection = this._selection.text();

    if (this._mouseLock) {
      this._storedSelection = selection;
    } else if (selection !== this._lastSelection) {
      this.textSelect.emit(selection);
    }
    this._lastSelection = selection;
  }

  @HostListener('document:contextmenu')
  onDocumentCtxMenu() {
    this._mouseLock = false;
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentTabPress(e: KeyboardEvent) {
    // Handle Tab press
    if (this._focused && e.key === 'Tab') {
      e.preventDefault();

      this._selection.insertText('\u2003');
      const html = this.editor().nativeElement.innerHTML;
      this.input.emit(html);
    }
  }

  onPaste(e: Event) {
    // e.preventDefault();
  }
}
