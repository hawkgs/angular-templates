import { List } from 'immutable';
import { BoardList, Card, Label } from '../../../models';
import {
  ApiBoardList,
  ApiBoardDataResponse,
  ApiCard,
  ApiLabel,
} from './api-types';

export const mapCard = (card: ApiCard) =>
  new Card({
    id: card.id,
    title: card.title,
    labelIds: List(card.labelIds),
    pos: card.pos,
    listId: card.listId,
    description: card.description,
  });

export const mapBoardList = (list: ApiBoardList) =>
  new BoardList({
    id: list.id,
    pos: list.pos,
    name: list.name,
    boardId: list.boardId,
  });

export const mapLabel = (label: ApiLabel) =>
  new Label({
    id: label.id,
    name: label.name,
    color: label.color,
  });

export const mapBoardLists = ({
  boardId,
  lists,
}: ApiBoardDataResponse): List<BoardList> =>
  List(lists.map((l, i) => mapBoardList({ ...l, pos: i, boardId })));

export const mapBoardListsCards = ({
  lists,
}: ApiBoardDataResponse): List<Card> =>
  List(
    lists
      .map((l) =>
        List(l.cards.map((c, i) => mapCard({ ...c, pos: i, listId: l.id }))),
      )
      .reduce((prev, curr) => prev.concat(curr), List()),
  );

export const mapLabels = ({ labels }: ApiBoardDataResponse): List<Label> =>
  List(labels.map((l) => mapLabel(l)));
