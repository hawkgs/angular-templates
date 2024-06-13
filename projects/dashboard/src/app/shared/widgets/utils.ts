const CHANNEL_SIZE = 255;

export function colorGenerator(dataValue: number, dataIndex: number): string {
  const r = dataValue % CHANNEL_SIZE;
  const g = dataIndex ** dataIndex % CHANNEL_SIZE;
  const b = 100;

  return `rgb(${r}, ${g}, ${b})`;
}
