const http = require('http');

const LibraryController = require('./controllers/LibraryController');
const AuthorController = require('./controllers/AuthorController');
const UserController = require('./controllers/UserController');
const BookController = require('./controllers/BookController');

const checkIsAdminOrSelf = require('./middlewares/checkIsAdminOrSelf');
const checkIsAdmin = require('./middlewares/checkIsAdmin');

const {
  authenticate,
  removeToken,
  authorize,
  logout,
} = require('./middlewares/auth');

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

  // Authors routes
  router.post('/authors', authorize, checkIsAdmin, AuthorController.create);
  router.get('/authors', authorize, AuthorController.readAll);
  router.get('/authors/#id', authorize, AuthorController.readOne);
  router.put('/authors/#id', authorize, checkIsAdmin, AuthorController.update);
  router.delete('/authors/#id', authorize, checkIsAdmin, AuthorController.delete);

  // Users routes
  router.post('/signup', UserController.create);
  router.get('/users', authorize, checkIsAdmin, UserController.readAll);
  router.get('/users/#id', authorize, checkIsAdminOrSelf, UserController.readOne);
  router.put('/users/#id', authorize, checkIsAdminOrSelf, UserController.update);
  router.delete('/users/#id', authorize, checkIsAdminOrSelf, removeToken, UserController.delete);

  // Books routes
  router.post('/books',
    authorize,
    checkIsAdmin,
    BookController.create,
    AuthorController.addAuthorBook,
    LibraryController.addNewBook,
  );
  router.get('/books', authorize, BookController.readAll);
  router.get('/books/#id', authorize, BookController.readOne);
  router.put('/books/#id', authorize, checkIsAdmin, BookController.update);
  router.delete('/books/#id',
    authorize,
    checkIsAdmin,
    BookController.delete,
    AuthorController.removeAuthorBook,
    LibraryController.removeBook,
  );

  // Library routes
  router.post('/library/borrow-book', authorize, LibraryController.borrowBook);
  router.post('/library/deliver-book', authorize, LibraryController.deliverBook);
  router.get('/library', authorize, checkIsAdmin, LibraryController.read);

  router.post('/login', authenticate);
  router.post('/logout', logout);

  await router.process();
});

server.listen(port, () => console.log(`>> Server is running at localhost:${port}!`));
