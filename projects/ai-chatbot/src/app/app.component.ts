import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { InputComponent, InputEvent } from './shared/input/input.component';

@Component({
  selector: 'acb-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, InputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  completeFn?: () => void;

  onSend(e: InputEvent) {
    console.log(e.message);
    this.completeFn = e.complete;
    setTimeout(() => {
      e.complete();
    }, 5000);
  }

  onAbort() {
    if (this.completeFn) {
      this.completeFn();
      console.log('aborted');
    }
  }
}
