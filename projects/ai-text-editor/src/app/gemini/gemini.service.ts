import { inject, Injectable } from '@angular/core';
import { GEMINI_API } from './gemini-api.provider';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private _geminiApi = inject(GEMINI_API);

  async generate(prompt: string, targetText?: string): Promise<string> {
    const apiPrompt = targetText ? `${prompt}: "${targetText}"` : prompt;
    const result = await this._geminiApi.generateContent(apiPrompt);
    const response = await result.response;

    return response.text();
  }
}
