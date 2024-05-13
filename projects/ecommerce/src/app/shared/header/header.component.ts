import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@ngx-templates/shared/icon';
import { AppLogoComponent } from '@ngx-templates/shared/app-logo';
import { CartService } from '../../data-access/cart.service';

@Component({
  selector: 'ec-header',
  standalone: true,
  imports: [RouterModule, IconComponent, AppLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cart = inject(CartService);
}
