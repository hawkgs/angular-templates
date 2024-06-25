import { Component } from '@angular/core';
import { IconComponent } from '@ngx-templates/shared/icon';

@Component({
  selector: 'ig-footer',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {}
