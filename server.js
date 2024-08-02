const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// In-memory store for URL mappings
let urlMappings = {};

// Endpoint to shorten URLs
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl || typeof longUrl !== 'string') {
      return res.status(400).json({ error: 'Invalid URL' });
    }
  
    const shortUrl = Math.random().toString(36).substring(7);
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

// Error handling for invalid JSON
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON' });
  } else {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
