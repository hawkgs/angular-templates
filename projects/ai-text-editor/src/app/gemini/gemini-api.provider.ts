/* eslint-disable @typescript-eslint/no-explicit-any */

import { InjectionToken, Provider } from '@angular/core';
import { geminiApiMock } from './gemini-api-mock';

// Uncomment the following line and comment the next one
// import { GoogleGenerativeAI } from '@google/generative-ai';

declare const GoogleGenerativeAI: any;

export const GEMINI_API = new InjectionToken<any>('GEMINI_API');

// CAUTION: Using the Google AI SDK for JavaScript directly
// from a client-side app is recommended for prototyping only.
//
// Deploying the app with your API key will potentially expose it
// to malicious actors.
//
// You can create a simple web server with the language/platform
// of your choice instead.
//
// For more information, refer to:
// https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web
export const API_KEY = 'XXXXxxxxXXXXxxxxXXXX';

// Gemini API provider
export const geminiApiProvider = (): Provider => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  return {
    provide: GEMINI_API,
    useValue: model,
  };
};

// Gemini API mock provider
export const geminiApiMockProvider = (): Provider => {
  return {
    provide: GEMINI_API,
    useValue: geminiApiMock,
  };
};
