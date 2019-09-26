const http = require('http');

const UserController = require('./controllers/UserController');
const writeResponse = require('./utils/api/writeResponse');
const env = require('./config/environments');
const Router = require('./router');

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const router = Router(req, res);

  router.get('/', () => {
    writeResponse(res, 200, {
      message: 'UHUL! The API is Up && Running!!!',
    });
  });

  router.post('/users', UserController.create);
  router.get('/users', UserController.readAll);

  router.process();
});

server.listen(env.port, () => console.log(`>> Server is running at localhost:${env.port}!`));
