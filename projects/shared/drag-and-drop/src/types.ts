/**
 * Coordinates
 */
export type Coor = { x: number; y: number };

/**
 * Rectangle
 * - `p1` (i.e. point 1) – upper left point
 * - `p2` (i.e. point 2) – lower right point
 */
export type Rect = { p1: Coor; p2: Coor };
