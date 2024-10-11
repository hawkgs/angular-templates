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
  private _tempChat = signal<Chat | null>(null);
  private _lastUsedChat: string = '';

  chats = this._chats.asReadonly();
  tempChat = this._tempChat.asReadonly();

  sortedChats = computed(() =>
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

    this._updateChatQueries(chatId, (q) => q.concat(queries));
  }

  async createChat(message: string) {
    this._tempChat.set(
      new Chat({
        queries: List([this._createDummyQuery(message)]),
      }),
    );
    const chat = await this._chatbotApi.createChat(message);

    if (chat) {
      this._tempChat.set(null);
      this._chats.update((c) => c.set(chat.id, chat));
    }

    return chat;
  }

  async sendQuery(chatId: string, message: string) {
    this._lastUsedChat = chatId;
    const msgQuery = this._createDummyQuery(message);
    this._updateChatQueries(chatId, (q) => q.push(msgQuery));

    const query = await this._chatbotApi.sendQuery(chatId, message);
    this._lastUsedChat = '';

    if (query) {
      this._updateChatQueries(chatId, (q) => q.pop().push(query));
    }
  }

  abortLastQuery() {
    if (this._tempChat()) {
      this._tempChat.set(null);
    }
    if (this._lastUsedChat) {
      this._updateChatQueries(this._lastUsedChat, (q) => q.pop());
      this._lastUsedChat = '';
    }

    this._chatbotApi.abortLastQuery();
  }

  private _updateChatQueries(
    chatId: string,
    updateFn: (queries: List<Query>) => List<Query>,
  ) {
    this._chats.update((chats) => {
      let chat = chats.get(chatId)!;
      chat = chat.set('queries', updateFn(chat.queries));
      return chats.set(chat.id, chat);
    });
  }

  private _createDummyQuery(message: string) {
    return new Query({
      message,
      createdAt: new Date(),
    });
  }
}
