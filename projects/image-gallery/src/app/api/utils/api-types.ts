export type ApiImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  metadata?: { [key: string]: string | number };
};
