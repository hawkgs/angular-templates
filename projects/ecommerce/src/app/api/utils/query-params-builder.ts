const filterParamValue = (paramVal: string | number) =>
  typeof paramVal === 'string'
    ? paramVal.replace(/\?|=|&/g, '').replace(/\s/g, '+')
    : paramVal;

/**
 * Builds a query parameter string by a provided object.
 *
 * @param params An object with the query params;
 * @returns
 */
export function buildQueryParamsString(params?: {
  [key: string]: string | number;
}): string {
  if (!params) {
    return '';
  }

  const paramParts = [];

  for (const key in params) {
    paramParts.push(`${key}=${filterParamValue(params[key])}`);
  }

  return '?' + paramParts.join('&');
}
