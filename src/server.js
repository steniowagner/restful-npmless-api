const http = require('http');

const UserController = require('./controllers/UserController');
const Router = require('./router');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/users/#id', UserController.read);
  router.post('/cart/#item/qwe/#kaka', UserController.create, UserController.read);

  router.process();
});

server.listen(3000, () => console.log('>> Server is running at localhost:3000!'));
