import { inject, Injectable } from '@angular/core';
import { FETCH_API, fetchAbort } from '@ngx-templates/shared/fetch';
import { List, Map } from 'immutable';

import { environment } from '../../environments/environment';

import { Chat, Query } from '../../model';
import { mapChat, mapChats, mapQueries, mapQuery } from './utils/mappers';
import { buildQueryParamsString } from '../../../../shared/utils';

@Injectable({ providedIn: 'root' })
export class ChatbotApi {
  private _abortIfInProgress = fetchAbort();
  private _fetch = inject(FETCH_API);

  async getChats(): Promise<Map<string, Chat>> {
    const response = await this._fetch(`${environment.apiUrl}/chats`);
    const json = response?.ok ? await response.json() : [];

    return mapChats(json);
  }

  async createChat(message: string): Promise<Chat | undefined> {
    const signal = this._abortIfInProgress(this.sendQuery.name);

    const response = await this._fetch(`${environment.apiUrl}/chats`, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    }).catch(() => {}); // Handle aborted requests

    return response?.ok ? mapChat(await response.json()) : undefined;
  }

  async getChatQueries(
    chatId: string,
    params?: Partial<{
      pageSize: number;
      page: number;
    }>,
  ): Promise<List<Query>> {
    const queryParams = buildQueryParamsString({
      pageSize: environment.chatPageSize,
      ...params,
    });
    const response = await this._fetch(
      `${environment.apiUrl}/chats/${chatId}/queries${queryParams}`,
    );
    const json = response?.ok ? await response.json() : [];

    return mapQueries(json);
  }

  async sendQuery(chatId: string, message: string): Promise<Query | undefined> {
    const signal = this._abortIfInProgress(this.sendQuery.name);

    const response = await this._fetch(
      `${environment.apiUrl}/chats/${chatId}/queries`,
      {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      },
    ).catch(() => {}); // Handle aborted requests

    return response?.ok ? mapQuery(await response.json()) : undefined;
  }

  abortLastQuery() {
    this._abortIfInProgress('sendQuery');
    this._abortIfInProgress('createChat');
  }
}
