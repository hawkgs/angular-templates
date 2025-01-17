import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  contentChildren,
  input,
  model,
} from '@angular/core';
import { SelectorItemComponent } from '../selector-item/selector-item.component';

@Component({
  selector: 'ngx-selector-group',
  imports: [],
  templateUrl: './selector-group.component.html',
  styleUrl: './selector-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    for (const item of this.selectorItems()) {
      item.groupName.set(this.name());
      item.type.set(this.type());
      item.change.subscribe((selected) => {
        this.value.set(selected);

        for (const item of this.selectorItems()) {
          item.checked.set(item.value() === this.value());
        }
      });

      if (item.value() === this.value()) {
        item.checked.set(true);
      }
    }
  }
}
