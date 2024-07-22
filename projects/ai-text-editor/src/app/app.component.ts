import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TextEditorComponent } from './shared/text-editor/text-editor.component';
import { ModalOutletComponent } from '@ngx-templates/shared/modal';

@Component({
  selector: 'ate-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    TextEditorComponent,
    ModalOutletComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
