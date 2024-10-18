const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// A simple Node-Express app that serves Gemini output.
//
// WARNING: This is not a production grade server.
// It is a demo server used ONLY for showcasing the
// app templates.

const PORT = 5001;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Assign your Google AI API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

const ctx = new Map();

function printRequestData(req) {
  const prompt = req.body.prompt;
  const execTime = new Date();
  console.log(
    `\x1b[34m[${execTime.toDateString()} ${execTime.toLocaleTimeString()}]\x1b[0m`,
    `POST ${req.path}; Prompt: ${prompt || '<<EMPTY>>'}`,
  );
}

// Gemini standard content generation
// User: ai-text-editor
app.post('/gemini', async (req, res) => {
  let model = ctx.get(req.path);
  if (!model) {
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    ctx.set(req.path, model);
  }

  printRequestData(req);
  const prompt = req.body.prompt;

  if (!prompt) {
    res.json({ output: '' });
  } else {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = await response.text();
    res.json({ output });
  }
});

// Gemini chatbot
// User: ai-chatbot
app.post('/gemini-chat', async (req, res) => {
  let chat = ctx.get(req.path);
  if (!chat) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello' }],
        },
        {
          role: 'model',
          parts: [{ text: 'Great to meet you. What would you like to know?' }],
        },
      ],
    });

    ctx.set(req.path, chat);
  }

  printRequestData(req);
  const prompt = req.body.prompt;

  if (!prompt) {
    res.json({ output: '' });
  } else {
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const output = await response.text();
    res.json({ output });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[32m\u21D2 Gemini API listening on port ${PORT}\x1b[0m\n`);
});
