import { Component } from '@angular/core';
import { AppLogoComponent } from '@ngx-templates/shared/app-logo';
import { THEME_COMPONENTS } from '@ngx-templates/shared/theme';

@Component({
  selector: 'ig-header',
  standalone: true,
  imports: [AppLogoComponent, THEME_COMPONENTS],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
