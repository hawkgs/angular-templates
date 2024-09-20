import { BoardList, Card, Label } from '../../../models';
import { ApiRequestBoardList, ApiRequestCard, ApiRequestLabel } from './types';

export const mapApiRequestBoardList = (
  list: BoardList,
): ApiRequestBoardList => ({
  name: list.name,
});

export const mapApiRequestCard = (card: Card): ApiRequestCard => ({
  title: card.title,
  listId: card.listId,
  description: card.description,
  labelIds: card.labelIds.toArray(),
  pos: card.pos,
});

export const mapApiRequestLabel = (label: Label): ApiRequestLabel => ({
  name: label.name,
  color: label.color,
});
