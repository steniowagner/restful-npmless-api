const http = require('http');

const server = http.createServer((req, res) => res.end('Hello, world!'));

server.listen(3000, () => {
  console.log('>> Server is running at localhost:3000!');
});
