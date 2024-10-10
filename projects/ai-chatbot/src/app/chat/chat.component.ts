import { Component } from '@angular/core';
import { InputComponent, InputEvent } from './shared/input/input.component';

@Component({
  selector: 'acb-chat',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
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
