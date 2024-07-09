import { Record } from 'immutable';

interface ImageConfig {
  id: string;
  src: string;
  width: number;
  height: number;
  metadata?: { [key: string]: string | number };
}

const imageRecord = Record<ImageConfig>({
  id: '',
  src: '',
  width: 0,
  height: 0,
  metadata: undefined,
});

export class Image extends imageRecord {
  constructor(config: Partial<ImageConfig>) {
    super(config);
  }
}
