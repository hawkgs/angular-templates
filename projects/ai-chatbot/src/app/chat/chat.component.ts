import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
export class ChatComponent implements OnInit {
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

  completeFn?: () => void;

  async ngOnInit() {
    await this._chatbot.loadChats();

    const chatId = this._route.snapshot.paramMap.get('id');

    if (chatId && this._chatbot.chats().has(chatId)) {
      this.loading.set(true);
      this.chatId.set(chatId);
      await this._chatbot.loadChatQueries(chatId);
      this.loading.set(false);
    } else {
      this._router.navigate(['/'], { replaceUrl: true });
    }
  }

  async onSend(e: InputEvent) {
    this.completeFn = e.complete;
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

    this.completeFn();
  }

  onAbort() {
    if (this.completeFn) {
      this.completeFn();
    }
    this._chatbot.abortLastQuery();
  }
}
