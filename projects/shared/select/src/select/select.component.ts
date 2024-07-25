import {
  AfterContentInit,
  Component,
  contentChildren,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';

import {
  SelectedOption,
  SelectOptionComponent,
} from '../select-option/select-option.component';

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
  selected = signal<SelectedOption | null>(null);

  ngAfterContentInit() {
    this.options().forEach((opt) =>
      opt.optionSelect.subscribe((so) => {
        this.selected.set(so);
        this.showOptions.set(false);
      }),
    );
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
