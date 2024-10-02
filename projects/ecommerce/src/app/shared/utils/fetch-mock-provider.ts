import { withFetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { ecommerceRequestResponseMock } from './ec-request-response-mock';

export const fetchApiMockProvider = provideFetchApi(
  withFetchMock(ecommerceRequestResponseMock),
);
