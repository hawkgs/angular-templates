import {
  AfterContentInit,
  Component,
  HostBinding,
  contentChildren,
  input,
  model,
} from '@angular/core';
import { SelectorItemComponent } from '../selector-item/selector-item.component';

@Component({
  selector: 'ngx-selector-group',
  standalone: true,
  imports: [],
  templateUrl: './selector-group.component.html',
  styleUrl: './selector-group.component.scss',
})
export class SelectorGroupComponent implements AfterContentInit {
  name = input.required<string>();
  type = input<'rows' | 'columns'>('rows');
  value = model<string>();
  selectorItems = contentChildren(SelectorItemComponent);

  @HostBinding('class.columns-type')
  get isColumnsType() {
    return this.type() === 'columns';
  }

  ngAfterContentInit() {
    this.selectorItems().forEach((item) => {
      item.groupName.set(this.name());
      item.type.set(this.type());
      item.change.subscribe((selected) => {
        this.value.set(selected);
        this.selectorItems().forEach((i) =>
          i.checked.set(i.value() === this.value()),
        );
      });

      if (item.value() === this.value()) {
        item.checked.set(true);
      }
    });
  }
}
