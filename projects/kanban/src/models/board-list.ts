import { Record } from 'immutable';

interface BoardListConfig {
  id: string;
  name: string;
  idx: number;
  boardId: string;
}

const boardListRecord = Record<BoardListConfig>({
  id: '',
  name: '',
  idx: -1,
  boardId: '',
});

export class BoardList extends boardListRecord {
  constructor(config: BoardListConfig) {
    super(config);
  }
}
