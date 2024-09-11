import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { ecommerceRequestResponseMock } from './ec-request-response-mock';

export const fetchApiMockProvider = provideFetchApi(
  fetchMock(ecommerceRequestResponseMock),
);
