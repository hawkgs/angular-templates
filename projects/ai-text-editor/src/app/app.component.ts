import { Component } from '@angular/core';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';

@Component({
  selector: 'ate-root',
  standalone: true,
  imports: [ThemeSwitchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
