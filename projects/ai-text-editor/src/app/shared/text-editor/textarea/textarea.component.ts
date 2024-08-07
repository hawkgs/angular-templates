import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { SelectionManager } from '../selection-manager.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'ate-textarea',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements AfterViewInit {
  private _selection = inject(SelectionManager);
  private _selectionInProgress: boolean = false;

  editor = viewChild.required<ElementRef>('editor');
  contents = input<string>('');
  textSelect = output<string>();
  input = output<void>();
  ref = output<HTMLElement>();

  ngAfterViewInit() {
    setTimeout(() => {
      this.editor().nativeElement.focus();
    });

    this.ref.emit(this.editor().nativeElement);
  }

  onSelectStart() {
    this._selectionInProgress = true;
  }

  @HostListener('document:mouseup')
  @HostListener('document:keyup')
  @HostListener('document:touchend')
  onDocumentInteractionEnd() {
    if (this._selectionInProgress) {
      const text = this._selection.text();
      this.textSelect.emit(text);
    }

    this._selectionInProgress = false;
  }
}
