const http = require('http');

const Router = require('./router');

const UserController = require('./controllers/UserController');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/', UserController.read);
  router.post('/', UserController.create);

  router.process();

  res.end();
});

server.listen(3000, () => console.log('>> Server is running at localhost:3000!'));
