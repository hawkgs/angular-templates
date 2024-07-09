import { Record } from 'immutable';

interface ImageConfig {
  src: string;
  width: number;
  height: number;
  metadata?: { [key: string]: string | number };
}

const imageRecord = Record<ImageConfig>({
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
