import { buildQueryParamsString } from './query-params-builder';

describe('query-params-builder', () => {
  it('create a query param string from a single param', () => {
    const str = buildQueryParamsString({
      name: 'John',
    });

    expect(str).toEqual('?name=John');
  });

  it('create a query param string from multiple params', () => {
    const str = buildQueryParamsString({
      name: 'John',
      age: 45,
    });

    expect(str).toEqual('?name=John&age=45');
  });
});
