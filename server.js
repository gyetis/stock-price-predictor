const genai = require('@google/genai');
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const ai = new genai.GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY,
    apiVersion: 'v1',
});

// Serve HTML, CSS and browser-side JavaScript
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());

app.get('/api/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;
    const { from, to } = req.query;

    const url = new URL(
        `https://api.massive.com/v2/aggs/ticker/${encodeURIComponent(ticker)}/range/1/day/${from}/${to}`
    );
    url.searchParams.set('adjusted', 'true');
    url.searchParams.set('sort', 'asc');
    url.searchParams.set('limit', '120');
    url.searchParams.set('apiKey', process.env.MASSIVE_API_KEY);

    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
});

app.post('/api/googlegenai', async (req, res) => {
    const { input, systemInstruction } = req.body || {};
    if (typeof input !== 'string' || input.length === 0) {
        return res
            .status(400)
            .json({ error: 'A non-empty input is required.' });
    }

    try {
        const response = await ai.interactions.create({
            model: 'gemini-3.5-flash-lite',
            input: input,
            system_instruction: systemInstruction,
        });
        res.json({ text: response.output_text });
    } catch (error) {
        console.error('Google Gen AI request failed:', error);
        const status = Number.isInteger(error.status) ? error.status : 500;
        res.status(status).json({
            error: error.message || 'Google Gen AI request failed.',
        });
    }
});

// Start the local server after registering its routes
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
