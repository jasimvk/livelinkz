const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

let urlMappings = {}; // In-memory store

app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  const shortUrl = Math.random().toString(36).substring(7); // Simple random string
  urlMappings[shortUrl] = longUrl;
  res.json({ shortUrl: `https://${req.headers.host}/${shortUrl}` });
});

app.get('/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  const longUrl = urlMappings[shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
