import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { Map } from 'immutable';

import { SelectOptionComponent } from '../select-option/select-option.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'ngx-select',
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements AfterContentInit {
  private _doc = inject(DOCUMENT);

  options = contentChildren(SelectOptionComponent);

  title = input<string>();
  disabled = input<boolean>();
  placeholder = input<string>('');
  showOptions = signal<boolean>(false);
  selected = model<string | null>(null);
  presentationTexts = signal<Map<string, string>>(Map());

  ngAfterContentInit() {
    const valueDuplicates = new Set<string>();

    for (const opt of this.options()) {
      const value = opt.value();

      // Duplicates check
      if (valueDuplicates.has(value)) {
        throw new Error(
          `SelectComponent (ngx-select) detected two ngx-select-option instances with the same "${value}" value`,
        );
      }
      valueDuplicates.add(value);

      this.presentationTexts.update((m) =>
        m.set(opt.value(), opt.presentationText()),
      );

      // Subscribe to the click/select events.
      // They are automatically disposed when
      // the components are destroyed.
      opt.optionSelect.subscribe((value) => {
        this.selected.set(value);
        this.showOptions.set(false);
      });
    }
  }

  toggleOptions(e: Event) {
    if (this.disabled()) {
      return;
    }

    e.stopPropagation();
    this.showOptions.update((v) => !v);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showOptions.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(e: KeyboardEvent) {
    if (this.showOptions() && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();

      const options = this.options();
      const focusedIdx = options.findIndex(
        (cmp) => cmp.button().nativeElement === this._doc.activeElement,
      );

      let newIdx = focusedIdx + (e.key === 'ArrowDown' ? 1 : -1);
      newIdx = newIdx >= 0 ? newIdx % options.length : options.length - 1;

      options[newIdx].button().nativeElement.focus();
    }
  }
}
