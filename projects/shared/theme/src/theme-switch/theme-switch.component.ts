import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { IconComponent, IconName } from '@ngx-templates/shared/icon';
import { ThemeService, ThemeType } from '../theme.service';
import { ThemeLabelPipe } from './theme-label.pipe';

const THEME_SEQ: ThemeType[] = ['system', 'light', 'dark'];

const THEME_TO_ICON: { [key in ThemeType]: IconName } = {
  ['system']: 'Routine',
  ['light']: 'LightMode',
  ['dark']: 'DarkMode',
};

@Component({
  selector: 'ngx-theme-switch',
  imports: [IconComponent, ThemeLabelPipe],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitchComponent {
  private _theme = inject(ThemeService);

  currentTheme = this._theme.getTheme();
  iconOnly = input<boolean>(false);

  THEME_TO_ICON = THEME_TO_ICON;

  onThemeSwitch() {
    const currentIdx = THEME_SEQ.findIndex((t) => t === this.currentTheme());
    const newIdx = (currentIdx + 1) % THEME_SEQ.length;

    this._theme.setTheme(THEME_SEQ[newIdx]);
  }
}
