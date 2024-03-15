import { Component, inject } from '@angular/core';
import { ThemeService, ThemeType } from '../../theme.service';
import { IconComponent, IconName } from '../../icon/icon.component';
import { ThemeLabelPipe } from './theme-label.pipe';

const THEME_SEQ: ThemeType[] = ['system', 'light', 'dark'];

const THEME_TO_ICON: { [key in ThemeType]: IconName } = {
  ['system']: 'Routine',
  ['light']: 'LightMode',
  ['dark']: 'DarkMode',
};

@Component({
  selector: 'ec-theme-switch',
  standalone: true,
  imports: [IconComponent, ThemeLabelPipe],
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.scss',
})
export class ThemeSwitchComponent {
  private _theme = inject(ThemeService);

  currentTheme = this._theme.getTheme();

  THEME_TO_ICON = THEME_TO_ICON;

  onThemeSwitch() {
    const currentIdx = THEME_SEQ.findIndex((t) => t === this.currentTheme());
    const newIdx = (currentIdx + 1) % THEME_SEQ.length;

    this._theme.setTheme(THEME_SEQ[newIdx]);
  }
}
