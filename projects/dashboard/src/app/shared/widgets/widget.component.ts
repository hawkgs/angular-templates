import {
  Component,
  HostBinding,
  Injector,
  OnInit,
  Signal,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';
import { PlainWidgetComponent } from './plain-widget/plain-widget.component';
import { WidgetConfig } from './widget';
import { injectDataSourceInstance } from '../../data/utils';
import { DataType } from '../../data/types';

export type WidgetType = 'plain';

@Component({
  selector: 'db-widget',
  standalone: true,
  imports: [IconComponent, PlainWidgetComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent implements OnInit {
  private _injector = inject(Injector);

  type = input.required<WidgetType>();
  dataSourceId = input<string>();
  size = input<number>(1);
  config = input<WidgetConfig>();
  editMode = input<boolean>(false);
  previewData = input<DataType>();

  remove = output<void>();

  data?: Signal<DataType>;

  @HostBinding('style.grid-column')
  get gridColumn() {
    return 'span ' + this.size().toString();
  }

  ngOnInit() {
    const id = this.dataSourceId();
    if (!id) {
      return;
    }

    const srcInstance = injectDataSourceInstance(id, this._injector);
    if (srcInstance) {
      this.data = srcInstance.data;
      srcInstance.init();
    }
  }
}
