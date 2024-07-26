import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  execute(prompt: string, targetText: string): Promise<string> {
    return new Promise((r) => setTimeout(() => r('<< gemini_output >>'), 400));
  }
}
