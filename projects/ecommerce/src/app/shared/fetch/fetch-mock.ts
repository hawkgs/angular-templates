// Represents a Fetch API mock
export function fetchMock(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  return Promise.resolve({} as Response);
}
