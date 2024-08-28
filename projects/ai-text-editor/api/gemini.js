const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// A simple Node-Express app that serves Gemini output

const PORT = 3000;
const app = express();

// Generate content via Gemini
async function generateContent(prompt) {
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// Middlewares
app.use(express.json());
app.use(cors());

// Set up the model
// Assign your Google AI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.post('/gemini', (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    res.json({ output: '' });
  } else {
    generateContent(prompt).then((output) => res.json({ output }));
  }
});

app.listen(PORT, () => {
  console.log(`\u21D2 Gemini API listening on port ${PORT}\n`);
});
