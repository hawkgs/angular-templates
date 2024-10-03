import { withFetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { kanbanRequestResponseMock } from './kb-request-response-mock';
import { provideBoardState } from '../../board/data-access/board-state.provider';

// User for testing
export const mockFetchAndStateProvider = [
  provideFetchApi(
    withFetchMock(kanbanRequestResponseMock, {
      logging: false,
      requestDelay: 0,
    }),
  ),
  provideBoardState(),
];
