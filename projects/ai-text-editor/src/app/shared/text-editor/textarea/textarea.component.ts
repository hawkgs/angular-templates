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

  deselect() {
    this._textarea.textSelect.emit('');
  }

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
  private _elRef = inject(ElementRef);

  private _selectionInProgress: boolean = false;
  private _contentsInit: boolean = false;

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

  onSelectStart() {
    this._selectionInProgress = true;
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:keyup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onDocumentInteractionEnd(e: Event) {
    if (this._selectionInProgress) {
      const text = this._selection.text();
      this.textSelect.emit(text);
    } else {
      // Since the textarea selection is tightly bound
      // with the formatting controls, the logic below
      // clears it [selection], if the formatting controls
      // are NOT used (i.e. user clicks outside of the editor).
      // Formatting controls are usually direct descendants of
      // the parent/editor. You can provide a different parent
      // from the input if any layout changes are applied to
      // the text editor.
      const nativeEl = this._elRef.nativeElement as HTMLElement;
      const parent = this.parent() || nativeEl.parentElement;
      const target = e.target as Node;
      if (!parent?.contains(target)) {
        this.textSelect.emit('');
      }
    }
    this._selectionInProgress = false;
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyup(e: KeyboardEvent) {
    // Handle keyboard selection
    if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const text = this._selection.text();
      this.textSelect.emit(text);
    }
  }

  onPaste(e: Event) {
    // e.preventDefault();
  }
}
