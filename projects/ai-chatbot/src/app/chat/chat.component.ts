import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { InputComponent, InputEvent } from './shared/input/input.component';
import { ChatbotService } from '../data-access/chatbot.service';

@Component({
  selector: 'acb-chat',
  standalone: true,
  imports: [InputComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private _route = inject(ActivatedRoute);
  private _chatbot = inject(ChatbotService);
  private _location = inject(Location);
  private _router = inject(Router);

  loading = signal<boolean>(false);
  chatId = signal<string>('');

  queries = computed(() => {
    const chat = this._chatbot.chats().get(this.chatId());
    if (!chat) {
      return this._chatbot.tempChat()?.queries;
    }
    return chat.queries.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  });

  private _markQueryCompleted?: () => void;

  constructor() {
    effect(() => {
      if (this._chatbot.chatsState() === 'loaded') {
        untracked(() => this._loadData());
      }
    });
  }

  async onSend(e: InputEvent) {
    this._markQueryCompleted = e.complete;
    const chatId = this.chatId();

    if (chatId) {
      await this._chatbot.sendQuery(chatId, e.message);
    } else {
      const chat = await this._chatbot.createChat(e.message);

      if (chat) {
        this.chatId.set(chat.id);
        this._location.go('chat/' + chat.id);
      }
    }

    this._markQueryCompleted();
  }

  onAbort() {
    if (this._markQueryCompleted) {
      this._markQueryCompleted();
    }
    this._chatbot.abortLastQuery();
  }

  private async _loadData() {
    const chatId = this._route.snapshot.paramMap.get('id');

    if (chatId && this._chatbot.chats().has(chatId)) {
      this.chatId.set(chatId);

      if (!this._chatbot.chatsPages().has(chatId)) {
        this.loading.set(true);
        await this._chatbot.loadChatQueries(chatId);
        this.loading.set(false);
      }
    } else {
      this._router.navigate(['/'], { replaceUrl: true });
    }
  }
}
