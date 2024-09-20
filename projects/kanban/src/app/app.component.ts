import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalOutletComponent } from '@ngx-templates/shared/modal';

import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'kb-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalOutletComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
