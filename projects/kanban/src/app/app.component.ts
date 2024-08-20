import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeSwitchComponent } from '@ngx-templates/shared/theme';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [RouterOutlet, ThemeSwitchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
