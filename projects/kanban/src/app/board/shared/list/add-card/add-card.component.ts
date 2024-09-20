import {
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'kb-add-card',
  standalone: true,
  imports: [],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss',
})
export class AddCardComponent {
  creatorAlwaysEnabled = input<boolean>(false);
  cardCreator = signal<boolean>(false);
  titleInput = viewChild<ElementRef>('titleInput');

  showCreator = computed(
    () => this.cardCreator() || this.creatorAlwaysEnabled(),
  );

  cardCreate = output<string>();
  blur = output<void>();

  constructor() {
    effect(() => {
      const titleInput = this.titleInput();
      if (this.showCreator() && titleInput) {
        titleInput.nativeElement.focus();
      }
    });
  }

  createCard() {
    const title = this.titleInput()?.nativeElement.value;
    if (title) {
      this.cardCreate.emit(title);
    }
    this.cardCreator.set(false);
    this.blur.emit();
  }

  @HostListener('document:keydown.enter')
  onEnterPress() {
    if (this.showCreator()) {
      this.titleInput()?.nativeElement.blur();
    }
  }
}
