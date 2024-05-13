import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ngx-app-logo',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.css',
})
export class AppLogoComponent {
  text = input.required<string>();
  routerLink = input<string>('');
}
