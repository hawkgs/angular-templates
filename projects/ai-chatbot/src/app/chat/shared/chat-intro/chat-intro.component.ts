import { Component, output } from '@angular/core';
import { PREDEFINED_MESSAGES } from './predefined-msgs';

@Component({
  selector: 'acb-chat-intro',
  standalone: true,
  imports: [],
  templateUrl: './chat-intro.component.html',
  styleUrl: './chat-intro.component.scss',
})
export class ChatIntroComponent {
  message = output<string>();

  predefinedMessages = PREDEFINED_MESSAGES;
}
