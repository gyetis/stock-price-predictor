const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve HTML, CSS and browser-side JavaScript
app.use(express.static(path.join(__dirname, 'src')));

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

// Start the local server after registering its routes
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
