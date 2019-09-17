const http = require('http');

const getRequestPayload = require('./utils/getRequestPayload');
const getURLData = require('./utils/getURLData');

const server = http.createServer(async (req, res) => {
  const { method, query, path } = getURLData(req);

  res.end('Hello, world!');

  console.log('>> Path: ', path);

  console.log('>> Query: ', query);

  console.log('>> Method: ', method);

  const payload = await getRequestPayload(req);

  console.log('>> Payload: ', payload, typeof payload);
});

server.listen(3004, () => {
  console.log('>> Server is running at localhost:3000!');
});
