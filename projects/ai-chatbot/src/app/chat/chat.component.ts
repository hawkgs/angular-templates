import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { InfiniteScrollComponent } from '@ngx-templates/shared/infinite-scroll';
import { List } from 'immutable';

import { InputComponent, InputEvent } from './shared/input/input.component';
import { ChatbotService } from '../data-access/chatbot.service';
import { QueryComponent } from './shared/query/query.component';
import { ChatIntroComponent } from './shared/chat-intro/chat-intro.component';
import { Query } from '../../model';

@Component({
  selector: 'acb-chat',
  standalone: true,
  imports: [
    InputComponent,
    QueryComponent,
    ChatIntroComponent,
    InfiniteScrollComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  private _route = inject(ActivatedRoute);
  private _chatbot = inject(ChatbotService);
  private _location = inject(Location);
  private _router = inject(Router);

  input = viewChild.required<InputComponent>('input');

  loading = signal<boolean>(false);
  chatId = signal<string>('');

  chat = computed(() => this._chatbot.chats().get(this.chatId()));

  queries = computed<List<Query>>(() => {
    const chat = this.chat();
    if (!chat) {
      return this._chatbot.tempChat()?.queries || List();
    }
    return chat.queries.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  });

  private _markQueryCompleted?: () => void;

  constructor() {
    const routerEvents = toSignal(this._router.events);

    effect(() => {
      const event = routerEvents();
      const state = this._chatbot.chatsState();

      if (event instanceof NavigationEnd && state === 'loaded') {
        untracked(() => this._loadData());
      }
    });
  }

  async send(e: InputEvent) {
    this._markQueryCompleted = e.complete;
    this._send(e.message);
    this._markQueryCompleted();
  }

  async sendPredefined(message: string) {
    this._send(message);
    this.input().focus();
  }

  abort() {
    if (this._markQueryCompleted) {
      this._markQueryCompleted();
    }
    this._chatbot.abortLastQuery();
  }

  async loadNextPage(complete: () => void) {
    await this._chatbot.loadChatQueries(this.chatId());
    complete();
  }

  private async _send(message: string) {
    const chatId = this.chatId();

    if (chatId) {
      await this._chatbot.sendQuery(chatId, message);
    } else {
      const chat = await this._chatbot.createChat(message);

      if (chat) {
        this.chatId.set(chat.id);
        this._location.go('chat/' + chat.id);
      }
    }
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
      // Replace the URL, if the provided ID is invalid
      this._router.navigate(['/'], { replaceUrl: !!chatId });
      this.chatId.set('');
    }
  }
}
