import {
  Component,
  HostBinding,
  OutputEmitterRef,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'ngx-selector-item',
  standalone: true,
  imports: [],
  templateUrl: './selector-item.component.html',
  styleUrl: './selector-item.component.scss',
})
export class SelectorItemComponent {
  value = input.required<string>();

  groupName = signal<string>('');
  checked = signal<boolean>(false);
  type = signal<'rows' | 'columns'>('rows');

  // We don't want to expose the changes as a component output.
  change = new OutputEmitterRef<string>();

  @HostBinding('class.checked')
  get isChecked() {
    return this.checked();
  }

  @HostBinding('class.columns-type')
  get isColumnsType() {
    return this.type() === 'columns';
  }
}
