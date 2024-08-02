const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory store for URLs
let urlMappings = {};

// Endpoint to shorten URLs
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  const shortUrl = Math.random().toString(36).substring(7); // Simple random string
  urlMappings[shortUrl] = longUrl;
  res.json({ shortUrl: `https://${req.headers.host}/${shortUrl}` });
});

// Endpoint to redirect from shortened URL
app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const longUrl = urlMappings[shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Not found');
  }
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
