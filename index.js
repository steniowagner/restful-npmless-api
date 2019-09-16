const http = require('http');

const parseURL = require('./utils/parseURL');

const server = http.createServer((req, res) => {
  const path = parseURL(req.url);

  res.end('Hello, world!');

  console.log('>> URL Path: ', path);
});

server.listen(3004, () => {
  console.log('>> Server is running at localhost:3000!');
});
