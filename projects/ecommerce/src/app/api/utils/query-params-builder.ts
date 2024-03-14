// Drop ?, =, & signs from the query parameter value
// and then replace spaces with a plus
const filterParamValue = (paramVal: string) =>
  paramVal.replace(/\?|=|\$|&/g, '').replace(/\s/g, '+');

/**
 * Builds a query parameter string by a provided object.
 *
 * @param params An object with the query params;
 * @returns
 */
export function buildQueryParamsString(params?: {
  [key: string]: string | number | string[];
}): string {
  if (!params) {
    return '';
  }

  const paramParts = [];

  for (const key in params) {
    if (!params[key]) {
      continue;
    }

    const value = params[key];
    let processedValue = value;

    if (typeof params[key] === 'string') {
      processedValue = filterParamValue(params[key] as string);
    } else if (params[key] instanceof Array) {
      processedValue = (params[key] as string[]).join(',');
    }

    paramParts.push(`${key}=${processedValue}`);
  }

  return '?' + paramParts.join('&');
}
