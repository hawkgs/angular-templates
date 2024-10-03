import { withFetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { imgGalleryRequestResponseMock } from './ig-request-response-mock';

// Used for testing
export const fetchApiMockProvider = provideFetchApi(
  withFetchMock(imgGalleryRequestResponseMock, {
    logging: false,
    requestDelay: 0,
  }),
);
