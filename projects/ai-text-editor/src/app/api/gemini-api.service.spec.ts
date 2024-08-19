import { TestBed } from '@angular/core/testing';
import { GeminiApi } from './gemini-api.service';
import { fetchMock, provideFetchApi } from '@ngx-templates/shared/fetch';
import { geminiApiMock } from '../shared/utils/gemini-api-mock';

describe('GeminiApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideFetchApi(fetchMock(geminiApiMock)), GeminiApi],
    });
  });

  it('should generate content by a provided prompt', async () => {
    const geminiApi = TestBed.inject(GeminiApi);
    const output = await geminiApi.generate('Generate something');

    expect(output.length).toBeGreaterThan(0);
  });
});
