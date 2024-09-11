import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { imgGalleryRequestResponseMock } from './ig-request-response-mock';

export const fetchApiMock = provideFetchApi(
  fetchMock(imgGalleryRequestResponseMock),
);
