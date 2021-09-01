const express = require('express');

const port = 5000;

// 1. create the server (application)
const server = express();

// 2. declare routes
server.get('/', (req, res) => {
  res.status(200);
  res.type('text/plain');
  res.send('Hello World from Express Node Server');
});

// 3. start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});