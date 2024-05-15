import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalOutletComponent } from '@ngx-templates/shared/modal';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { WidgetsGridComponent } from './shared/widgets-grid/widgets-grid.component';

@Component({
  selector: 'db-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    WidgetsGridComponent,
    ModalOutletComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
