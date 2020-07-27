const express = require('express');
const app = express();
const fs = require('fs');

const txtMap = new Map();

app.set('query parser', 'simple');


app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});


app.set('query parser', 'simple');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});

app.post('/send', (req, res) => {
  const key = req.query.key;
  res.status(200);
  
  req.on('data', (chunk) => {
    const set = txtMap.get(key);
    if (!set) return;
    for (const res of set) {
      res.write(chunk);
    }
  });
  
  req.on('end', (chunk) => {
    if (res.writableEnded) return;
    res.send('Ended');
  });
});


app.get('/receive', (req, res) => {
  const key = req.query.key;
  if (!txtMap.has(key)) {
    txtMap.set(key, new Set());
  }
  txtMap.get(key).add(res);
  res.on('close', () => {
    const set = txtMap.get(key);
    set.delete(res);
    if (set.size === 0) txtMap.delete(key);
  });
  res.status(200);
  res.set('Content-Type', 'text/plain');
});


app.use(express.static('public'));

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
