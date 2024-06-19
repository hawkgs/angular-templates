export type Coor = { x: number; y: number };

/**
 * Get angle coordinates (Cartesian coordinates).
 */
export function getAngleCoor(
  degrees: number,
  radius: number,
  center: Coor,
): Coor {
  const rads = ((degrees - 90) * Math.PI) / 180;

  return {
    x: radius * Math.cos(rads) + center.x,
    y: radius * Math.sin(rads) + center.y,
  };
}
