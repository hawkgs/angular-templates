import { onRequest } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Set up the model
// Assign your Google AI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate content via Gemini
 *
 * @param prompt
 * @returns Gemini output
 */
async function generateContent(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// Request handler
export const gemini = onRequest((request, response) => {
  const prompt = request.body.prompt;

  if (!prompt) {
    response.json({ output: '' });
  }
  generateContent(prompt).then((output) => response.json({ output }));
});
