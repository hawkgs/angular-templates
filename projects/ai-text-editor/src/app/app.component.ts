import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TextEditorComponent } from './shared/text-editor/text-editor.component';

@Component({
  selector: 'ate-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TextEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
