import { Record } from 'immutable';
import { WidgetConfig, WidgetType } from '../widgets/widget';

export interface WidgetGridItemConfig {
  id: string;
  position: number;
  type: WidgetType;
  config: WidgetConfig;
  dataSourceId: string;
  size: number;
}

const widgetGridItemRecord = Record<WidgetGridItemConfig>({
  id: '',
  position: 0,
  type: 'plain',
  config: null,
  dataSourceId: '',
  size: 1,
});

export class WidgetGridItem extends widgetGridItemRecord {
  constructor(config: Partial<WidgetGridItemConfig>) {
    super(config);
  }
}
