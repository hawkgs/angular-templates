import { computed, inject, Injectable, signal } from '@angular/core';
import { Map, List } from 'immutable';

import { Chat, Query } from '../../model';
import { ChatbotApi } from '../api/chatbot-api.service';

type ItemState = 'null' | 'loading' | 'loaded';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private _chatbotApi = inject(ChatbotApi);

  private _chats = signal<Map<string, Chat>>(Map());
  private _chatsState = signal<ItemState>('null');
  private _chatsPages = signal<Map<string, number>>(Map());
  private _tempChat = signal<Chat | null>(null);
  private _lastUsedChat: string = '';

  chats = this._chats.asReadonly();
  tempChat = this._tempChat.asReadonly();
  chatsState = this._chatsState.asReadonly();
  chatsPages = this._chatsPages.asReadonly();

  sortedChats = computed(() =>
    this._chats()
      .toList()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
  );

  async loadChats() {
    this._chatsState.set('loading');
    const chats = await this._chatbotApi.getChats();
    this._chatsState.set('loaded');

    this._chats.update((c) => c.concat(chats));
  }

  async loadChatQueries(chatId: string) {
    const page = this._chatsPages().get(chatId) || 1;
    this._chatsPages.update((p) => p.set(chatId, page + 1));

    const queries = await this._chatbotApi.getChatQueries(chatId, { page });

    this._updateChatQueries(chatId, (q) => q.concat(queries), false);
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
      this._chatsPages.update((p) => p.set(chat.id, 1));
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
      this._chats.update((c) =>
        c.set(chatId, c.get(chatId)!.set('updatedAt', new Date())),
      );
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
    syncTotalCount: boolean = true,
  ) {
    this._chats.update((chats) => {
      let chat = chats.get(chatId)!;
      const updatedQueries = updateFn(chat.queries);
      let totalChange = 0;

      if (syncTotalCount) {
        totalChange =
          updatedQueries.size > chat.queries.size
            ? 1
            : updatedQueries.size < chat.queries.size
              ? -1
              : 0;
      }

      chat = chat
        .set('queries', updatedQueries)
        .set('totalQueries', chat.totalQueries + totalChange);

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
