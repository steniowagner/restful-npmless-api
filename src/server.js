const http = require('http');

const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');

const env = require('./config/environments');
const Router = require('../server/router');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/', (_, res) =>
    res.send().status(200).data({
      message: 'UHUL! The API is Up && Running!!!'
    })
  );

  router.get('/users/#id', UserController.readOne);
  router.put('/users/#id', UserController.update);

  router.get('/users', UserController.readAll);

  router.post('/signup', UserController.create);
  router.get('/login', AuthController.authenticate);

  await router.process();
});

server.listen(env.port, () => console.log(`>> Server is running at localhost:${env.port}!`));
