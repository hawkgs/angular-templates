import { Coor } from './types';

/**
 * Returns the coordinates of the mouse/finger based on the event type.
 *
 * @param e Mouse or touch event
 * @returns The position as `Coor`
 */
export const getClientPointerPos = (e: MouseEvent | TouchEvent): Coor => {
  if (e instanceof MouseEvent) {
    return { x: e.clientX, y: e.clientY };
  }
  return {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };
};
