const http = require('http');

const UserController = require('./controllers/UserController');
const env = require('./config/environments');
const Router = require('../server/router');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/', () => {
    res.writeHead(200);

    res.write(JSON.stringify({
      message: 'UHUL! The API is Up && Running!!!',
    }));

    res.end();
  });

  router.post('/users', UserController.create);
  router.get('/users', UserController.readAll);

  await router.process();
});

server.listen(env.port, () => console.log(`>> Server is running at localhost:${env.port}!`));
