import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartService } from '../../data-access/cart.service';
import { IconComponent } from '../icon/icon.component';

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
