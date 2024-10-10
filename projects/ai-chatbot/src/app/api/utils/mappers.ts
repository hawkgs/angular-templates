import { List } from 'immutable';
import { Chat, Query } from '../../../model';
import { ApiChat, ApiQuery } from './api-types';

export const mapChat = (chat: ApiChat) =>
  new Chat({
    id: chat.id,
    name: chat.name,
    createdAt: new Date(chat.createdAt),
    updatedAt: new Date(chat.updatedAt),
  });

export const mapChats = (chats: ApiChat[]) => List(chats.map(mapChat));

export const mapQuery = (query: ApiQuery) =>
  new Query({
    id: query.id,
    message: query.message,
    response: query.response,
    createdAt: new Date(query.createdAt),
  });

export const mapQueries = (queries: ApiQuery[]) => List(queries.map(mapQuery));
