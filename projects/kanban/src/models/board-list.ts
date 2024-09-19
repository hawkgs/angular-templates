import { Record } from 'immutable';

interface BoardListConfig {
  id: string;
  name: string;
  pos: number;
  boardId: string;
}

const boardListRecord = Record<BoardListConfig>({
  id: '',
  name: '',
  pos: -1,
  boardId: '',
});

export class BoardList extends boardListRecord {
  constructor(config: Partial<BoardListConfig>) {
    super(config);
  }
}
