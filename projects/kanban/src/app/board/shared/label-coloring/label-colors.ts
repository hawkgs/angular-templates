import { OrderedMap } from 'immutable';

export const LABEL_COLORS = OrderedMap<string, { hex: string; light: boolean }>(
  [
    ['red', { hex: '#e83535', light: false }],
    ['orange', { hex: '#f26e0d', light: false }],
    ['yellow', { hex: '#ffae00', light: true }],
    ['green', { hex: '#44b042', light: false }],
    ['blue', { hex: '#077cff', light: false }],
    ['purple', { hex: '#a24dd9', light: false }],
  ],
);
