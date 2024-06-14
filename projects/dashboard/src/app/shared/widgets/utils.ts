const CHANNEL_SIZE = 255;

/**
 * Generates an RGB color by a provided value and index.
 *
 * @param dataValue
 * @param dataIndex
 * @returns RGB color string
 */
export function colorGenerator(dataValue: number, dataIndex: number): string {
  const r = dataValue % CHANNEL_SIZE;
  const g = dataIndex ** dataIndex % CHANNEL_SIZE;
  const b = 100;

  return `rgb(${r}, ${g}, ${b})`;
}
