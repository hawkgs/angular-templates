/**
 * Returns mocked data based on a request URL
 *
 * @param url Request URL
 * @returns
 */
export function kanbanRequestResponseMock(url: string): object {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = {};
  const paramsStr = url.split('?').pop();

  const params: { [key: string]: string } = paramsStr
    ? paramsStr
        .split('&')
        .map((pair) => pair.split('='))
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    : {};

  return response;
}
