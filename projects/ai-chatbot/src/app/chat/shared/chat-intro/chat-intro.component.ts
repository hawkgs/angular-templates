import { Component, output } from '@angular/core';

const PREDEFINED_MESSAGES = [
  'How tall is Empire State Building?',
  'When do we switch to DST?',
];

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
