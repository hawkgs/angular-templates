import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';

const DEFAULT_MAX_LENGTH = 50;
const DEFAULT_V_PADDING = 4;
const DEFAULT_H_PADDING = 4;

@Component({
  selector: 'kb-interactive-title',
  standalone: true,
  imports: [],
  templateUrl: './interactive-title.component.html',
  styleUrl: './interactive-title.component.scss',
})
export class InteractiveTitleComponent implements AfterViewInit {
  private _renderer = inject(Renderer2);

  textarea = viewChild.required<ElementRef>('textarea');

  value = input.required<string>();
  verticalPadding = input<number>(DEFAULT_V_PADDING);
  horizontalPadding = input<number>(DEFAULT_H_PADDING);
  maxLength = input<number>(DEFAULT_MAX_LENGTH);
  titleBlur = output<string>();

  ngAfterViewInit() {
    this._setPadding();
    this.setHeight();
  }

  onTextareaBlur() {
    const title = this.textarea().nativeElement.value;

    if (title) {
      this.titleBlur.emit(title);
    } else {
      this.textarea().nativeElement.value = this.value();
    }
  }

  onTextareaKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  setHeight() {
    const element = this.textarea().nativeElement;

    // We need to reset the height in order to
    // recalculate the updated scrollHeight.
    this._renderer.setStyle(element, 'height', null);

    const height = element.scrollHeight - this.verticalPadding() * 2;
    this._renderer.setStyle(element, 'height', height + 'px');
  }

  private _setPadding() {
    const h = this.horizontalPadding() + 'px';
    const v = this.verticalPadding() + 'px';

    this._renderer.setStyle(
      this.textarea().nativeElement,
      'padding',
      `${v} ${h}`,
    );
  }
}
