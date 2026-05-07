const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Serve the app
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (req, res) => res.json({ status: 'DTF Proxy running' }));

// Ideogram proxy
app.post('/ideogram', async (req, res) => {
  const apiKey = req.headers['x-ideogram-key'];
  if (!apiKey) return res.status(400).json({ error: 'Missing x-ideogram-key header' });
  try {
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Anthropic proxy
app.post('/anthropic', async (req, res) => {
  const apiKey = req.headers['x-claude-key'];
  if (!apiKey) return res.status(400).json({ error: 'Missing x-claude-key header' });
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DTF proxy running on port ${PORT}`));
