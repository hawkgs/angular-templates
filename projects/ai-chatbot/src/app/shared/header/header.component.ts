import { Component } from '@angular/core';
import { AppLogoComponent } from '@ngx-templates/shared/app-logo';

@Component({
  selector: 'acb-header',
  standalone: true,
  imports: [AppLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
