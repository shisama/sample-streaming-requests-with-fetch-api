const express = require('express');
const app = express();
const receivers = new Map();
const fs = require('fs');
const path = require('path');

app.set('query parser', 'simple');

const txtMap = new Map();

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
    const char = chunk.toString();
    const val = (txtMap.get(key) || "") + char;
    txtMap.set(key, val);
  });
  
  req.on('end', (chunk) => {
    if (res.writableEnded) return;
    res.send('Ended');
  });
});


app.get('/receive', (req, res) => {
  const txt = txtMap.get(req.query.key);
  console.log("!", txt);
  res.end(txt);
  fs.writeFileSync("output", txt);
});


app.use(express.static('public'));

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
