/**
 * Generate a short UUID.
 *
 * WARNING: Use only for mock data.
 *
 * @returns UUID
 */
export function generateShortUUID(): string {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let uuid = '';

  for (let i = 0; i < 8; i++) {
    uuid += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return uuid;
}
