import { MockFn } from '@ngx-templates/shared/fetch';

const DEFAULT_PAGE_SIZE = 15;
const DEFAULT_PAGE = 1;

/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export const acbRequestResponseMock: MockFn = (url: string): object => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = {};

  return response;
};
