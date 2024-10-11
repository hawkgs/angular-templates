import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Map as ImmutMap, List } from 'immutable';

import { Chat, Query } from '../../model';
import { ChatbotApi } from '../api/chatbot-api.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private _chatbotApi = inject(ChatbotApi);

  private _chats = signal<ImmutMap<string, Chat>>(ImmutMap());
  private _queries = new Map<string, Signal<List<Query>>>();
  private _chatPage = new Map<string, number>();

  chats = computed(() =>
    this._chats()
      .toList()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
  );

  queries = (chatId: string): Signal<List<Query>> => {
    let queries = this._queries.get(chatId);
    if (!queries) {
      queries = computed(() =>
        (this._chats().get(chatId)?.queries || List()).sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        ),
      );
    }
    return queries;
  };

  async loadChats() {
    const chats = await this._chatbotApi.getChats();
    this._chats.update((c) => c.concat(chats));
  }

  async loadChatQueries(chatId: string) {
    const page = this._chatPage.get(chatId) || 1;
    this._chatPage.set(chatId, page + 1);
    const queries = await this._chatbotApi.getChatQueries(chatId, { page });

    this._chats.update((chats) => {
      let chat = chats.get(chatId)!;
      chat = chat.set('queries', chat.queries.concat(queries));
      return chats.set(chat.id, chat);
    });
  }

  async createChat(message: string) {
    const chat = await this._chatbotApi.createChat(message);

    if (chat) {
      this._chats.update((c) => c.set(chat.id, chat));
    }
  }

  async sendQuery(chatId: string, message: string) {
    const query = await this._chatbotApi.sendQuery(chatId, message);

    if (query) {
      this._chats.update((chats) => {
        let chat = chats.get(chatId)!;
        chat = chat.set('queries', chat.queries.push(query));
        return chats.set(chat.id, chat);
      });
    }
  }

  abortLastQuery() {
    this._chatbotApi.abortLastQuery();
  }
}
