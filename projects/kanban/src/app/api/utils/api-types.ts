// Response types

export type ApiCard = {
  id: string;
  title: string;
  labelIds: string[];
  idx?: number;
  listId?: string;
  description?: string;
};

export type ApiBoardList = {
  id: string;
  name: string;
  cards: ApiCard[];
  idx?: number;
  boardId?: string;
};

export type ApiLabel = {
  id: string;
  name: string;
  color: string;
};

export type ApiBoardDataResponse = {
  boardId: string;
  lists: ApiBoardList[];
  labels: ApiLabel[];
};

// Request types

export type ApiRequestBoardList = {
  idx?: number;
  name?: string;
};

export type ApiRequestCard = {
  title?: string;
  labelIds?: string[];
  idx?: number;
  listId?: string;
  description?: string;
};

export type ApiRequestLabel = {
  name?: string;
  color?: string;
};
