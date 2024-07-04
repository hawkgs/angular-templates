export interface ImageConfig {
  src: string;
  width: number;
  height: number;
  metadata?: { [key: string]: string | number };
}
