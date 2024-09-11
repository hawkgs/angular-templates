import { BoardList, Card, Label } from '../../../models';
import {
  ApiRequestBoardList,
  ApiRequestCard,
  ApiRequestLabel,
} from './api-types';

export const mapApiRequestBoardList = (
  list: BoardList,
): ApiRequestBoardList => ({
  name: list.name,
  idx: list.idx,
});

export const mapApiRequestCard = (card: Card): ApiRequestCard => ({
  title: card.title,
  listId: card.listId,
  description: card.description,
  labelIds: card.labelIds.toArray(),
  idx: card.idx,
});

export const mapApiRequestLabel = (label: Label): ApiRequestLabel => ({
  name: label.name,
  color: label.color,
});
