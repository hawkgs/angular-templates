export function precisionRound(value: number, precision: number) {
  const p = 10 ** precision;
  return Math.round(value * p) / p;
}
