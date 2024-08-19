import { inject, Injectable } from '@angular/core';
import { FETCH_API } from '@ngx-templates/shared/fetch';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GeminiApi {
  private _fetch = inject(FETCH_API);

  async generate(prompt: string, targetText?: string): Promise<string> {
    const apiPrompt = targetText ? `${prompt}: "${targetText}"` : prompt;
    const response = await this._fetch(environment.geminiApiUrl, {
      method: 'POST',
      body: JSON.stringify({ prompt: apiPrompt }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();

    return json.output;
  }
}
