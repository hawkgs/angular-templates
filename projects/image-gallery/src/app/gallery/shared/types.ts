// Note(Georgi): Temp. Testing purposes
export type ImageConfig = {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  metadata?: { [key: string]: string | number };
};
