const http = require('http');

const AuthorController = require('./controllers/AuthorController');
const UserController = require('./controllers/UserController');
const AuthController = require('./controllers/AuthController');
const BookController = require('./controllers/BookController');

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

  router.post('/authors', AuthorController.create);

  router.get('/users/#id', AuthController.authorize, UserController.readOne);
  router.put('/users/#id', UserController.update);

  router.get('/users', UserController.readAll);
  router.post('/users', UserController.create);

  router.get('/books', BookController.readAll);
  router.post('/books', BookController.create);

  router.post('/signup', UserController.create);
  router.get('/login', AuthController.authenticate);


  await router.process();
});

server.listen(env.port, () => console.log(`>> Server is running at localhost:${env.port}!`));
