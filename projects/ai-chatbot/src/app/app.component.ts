import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { InputComponent } from './shared/input/input.component';

@Component({
  selector: 'acb-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  onPromptSend(msg: string) {
    console.log(msg);
  }
}
