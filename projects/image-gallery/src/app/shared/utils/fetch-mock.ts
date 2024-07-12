import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { imgGalleryRequestResponseMock } from './img-gallery-request-response-mock';

export const fetchApiMock = provideFetchApi(
  fetchMock(imgGalleryRequestResponseMock),
);
