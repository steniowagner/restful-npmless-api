const http = require('http');

const getURLData = require('./utils/getURLData');

const server = http.createServer((req, res) => {
  const { method, query, path } = getURLData(req);

  res.end('Hello, world!');

  console.log('>> Path: ', path);

  console.log('>> Query: ', query);

  console.log('>> Method: ', method);
});

server.listen(3004, () => {
  console.log('>> Server is running at localhost:3000!');
});
