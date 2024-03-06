/**
 * Builds a query parameter string by a provided object.
 *
 * @param params An object with the query params;
 * @returns
 */
export const buildQueryParamsString = (params?: {
  [key: string]: string | number;
}) => {
  if (!params) {
    return '';
  }

  const paramParts = [];

  for (const key in params) {
    paramParts.push(`${key}=${params[key]}`);
  }

  return '?' + paramParts.join('&');
};
