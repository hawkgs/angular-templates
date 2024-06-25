import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ImageGridComponent } from './shared/image-grid/image-grid.component';

@Component({
  selector: 'ig-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ImageGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
