import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  output,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'kb-new-card-input',
  standalone: true,
  imports: [],
  templateUrl: './new-card-input.component.html',
  styleUrl: './new-card-input.component.scss',
})
export class NewCardInputComponent implements AfterViewInit {
  private _renderer = inject(Renderer2);

  cardCreator = signal<boolean>(false);
  textarea = viewChild<ElementRef>('textarea');

  cardCreate = output<string>();
  cardBlur = output<void>();
  cardInput = output<void>();

  ngAfterViewInit() {
    this.textarea()?.nativeElement.focus();
  }

  createCard() {
    const title = this.textarea()?.nativeElement.value;
    if (title) {
      this.cardCreate.emit(title);
    }
    this.cardCreator.set(false);
    this.cardBlur.emit();
  }

  onTextareaInput() {
    this._autoSize();
    this.cardInput.emit();
  }

  @HostListener('document:keydown.enter')
  onEnterPress() {
    this.textarea()?.nativeElement.blur();
  }

  private _autoSize() {
    const textarea = this.textarea()?.nativeElement;
    this._renderer.setStyle(textarea, 'height', null);

    const filler = 5; // Fixes jankiness during typing
    const height = textarea.scrollHeight + filler;
    this._renderer.setStyle(textarea, 'height', height + 'px');
  }
}
