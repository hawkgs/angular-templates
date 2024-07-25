import {
  AfterContentInit,
  Component,
  contentChildren,
  HostListener,
  input,
  model,
  signal,
} from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { Map } from 'immutable';

import { SelectOptionComponent } from '../select-option/select-option.component';

@Component({
  selector: 'ngx-select',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements AfterContentInit {
  options = contentChildren(SelectOptionComponent);

  title = input<string>();
  showOptions = signal<boolean>(false);
  selected = model<string>('');
  presentationTexts = signal<Map<string, string>>(Map());

  ngAfterContentInit() {
    const valueDuplicates = new Set<string>();

    this.options().forEach((opt) => {
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
    });
  }

  toggleOptions(e: Event) {
    e.stopPropagation();
    this.showOptions.update((v) => !v);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.showOptions.set(false);
  }
}
