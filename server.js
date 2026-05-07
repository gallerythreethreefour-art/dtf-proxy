const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Health check
app.get('/', (req, res) => res.json({ status: 'DTF Proxy running' }));

// Ideogram proxy
app.post('/ideogram', async (req, res) => {
  const apiKey = req.headers['x-ideogram-key'];
  if (!apiKey) return res.status(400).json({ error: 'Missing x-ideogram-key header' });

  try {
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
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
