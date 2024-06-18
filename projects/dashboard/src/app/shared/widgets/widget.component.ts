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
import { WidgetConfig, WidgetType } from './widget';
import { injectDataSourceInstance } from '../../data/utils';
import { DataType } from '../../data/types';
import { DATA_SOURCES } from '../../data/sources';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'db-widget',
  standalone: true,
  imports: [
    IconComponent,
    PlainWidgetComponent,
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent implements OnInit {
  private _injector = inject(Injector);

  type = input.required<WidgetType>();
  dataSourceId = input<string>();
  size = input<number>(1);
  config = input<WidgetConfig>();
  title = input<string>();
  editMode = input<boolean>(false);
  previewData = input<DataType>();

  remove = output<void>();

  data?: Signal<DataType>;

  displayedTitle = computed(
    () =>
      this.title() ||
      DATA_SOURCES.find((ds) => ds.id === this.dataSourceId())?.name,
  );

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
