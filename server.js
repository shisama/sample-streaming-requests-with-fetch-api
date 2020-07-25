// Copyright 2018 Google LLC.
// SPDX-License-Identifier: Apache-2.0

const express = require('express');
const app = express();
const receivers = new Map();
const fs = require('fs');

app.set('query parser', 'simple');

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  next();
});

app.post('/send', (req, res) => {
  const channel = req.query.channel;
  if (!channel) {
    res.status(400).send('No channel given');
    return;
  }
  
  res.status(200);
  
  const writeStream = fs.createWriteStream('./output');
  
  req.pipe(writeStream);
  
  req.on('data', (chunk) => {
    const set = receivers.get(channel);
    if (!set) return;
    for (const res of set) res.write(chunk);
  });
  
  req.on('end', async (chunk) => {
    if (res.writableEnded) return;
    res.send('Ended');
  });
});

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
