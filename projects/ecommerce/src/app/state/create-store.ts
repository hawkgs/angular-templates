import { Signal, signal } from '@angular/core';

// function createAction() {}

// function createReducer() {}

// TBD
export function createStore<T>(
  initialState: T,
  reducer: (s: T, a: unknown) => T,
): { store: Signal<T>; dispatch: (action: unknown) => void } {
  const store = signal<T>(initialState);

  const dispatch = (action: unknown) => {
    store.set(reducer(store(), action));
  };

  return {
    dispatch,
    store: store.asReadonly(),
  };
}
