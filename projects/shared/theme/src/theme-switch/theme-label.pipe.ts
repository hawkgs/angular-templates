import { Pipe, PipeTransform } from '@angular/core';
import { ThemeType } from '../theme.service';

const THEME_TO_LABEL: { [key in ThemeType]: string } = {
  ['system']: 'System',
  ['light']: 'Light',
  ['dark']: 'Dark',
};

@Pipe({
  name: 'themeLabel',
})
export class ThemeLabelPipe implements PipeTransform {
  transform(value: ThemeType) {
    return THEME_TO_LABEL[value];
  }
}
