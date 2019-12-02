const http = require('http');

const AuthorController = require('./controllers/AuthorController');
const UserController = require('./controllers/UserController');
const BookController = require('./controllers/BookController');

const { authenticate, authorize } = require('./middlewares/auth');
const checkIsAdmin = require('./middlewares/checkIsAdmin');

const { port } = require('./config/environments');
const Router = require('../server/router');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/', (_, res) =>
    res.send().status(200).data({
      message: 'UHUL! The API is Up && Running!!!'
    })
  );

  router.post('/authors', authorize, checkIsAdmin, AuthorController.create);
  router.get('/authors', authorize, AuthorController.readAll);
  router.get('/authors/#id', authorize, AuthorController.readOne);
  router.put('/authors/#id', authorize, checkIsAdmin, AuthorController.update);
  router.delete('/authors/#id', authorize, checkIsAdmin, AuthorController.delete);

  router.post('/users', UserController.create);

  router.get('/login', authenticate);
  router.post('/signup', UserController.create);

  await router.process();
});

server.listen(port, () => console.log(`>> Server is running at localhost:${port}!`));
