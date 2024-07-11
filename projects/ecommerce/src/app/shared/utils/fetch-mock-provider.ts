import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { ecommerceRequestResponseMock } from './request-response-mock';

export const fetchApiMockProvider = provideFetchApi(
  fetchMock(ecommerceRequestResponseMock),
);
