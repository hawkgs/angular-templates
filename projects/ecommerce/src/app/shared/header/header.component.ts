import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '@ngx-templates/shared';
import { CartService } from '../../data-access/cart.service';

@Component({
  selector: 'ec-header',
  standalone: true,
  imports: [RouterModule, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cart = inject(CartService);
}
