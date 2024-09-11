import { Card, Label } from '../../../models';
import { ApiCard, ApiLabel } from './api-types';

export const mapApiCard = (card: Card): ApiCard => ({
  id: card.id,
  title: card.title,
  listId: card.listId,
  description: card.description,
  labelIds: card.labelIds.toArray(),
  idx: card.idx,
});

export const mapApiLabel = (label: Label): ApiLabel => ({
  id: label.id,
  name: label.name,
  color: label.color,
});
