import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ngx-app-logo',
  imports: [RouterModule, CommonModule],
  templateUrl: './app-logo.component.html',
  styleUrl: './app-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLogoComponent {
  text = input.required<string>();
  routerLink = input<string>('');
}
