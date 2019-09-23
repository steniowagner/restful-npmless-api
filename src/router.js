const getRequestParams = require('./utils/api/getRequestParams');
const checkIsSameRoute = require('./utils/api/checkIsSameRoute');
const writeResponse = require('./utils/api/writeResponse');
const { HTTP_METHODS } = require('./utils/constants');
const parseRequest = require('./utils/api/parseRequest');

const router = (req, res) => {
  const { method, path, query } = parseRequest(req);
  const middlewares = [];

  const addMiddlewares = (method, route, ...pipeline) => {
    const isValidPipeline = pipeline.every(pipe => typeof pipe === 'function');

    if (!isValidPipeline) {
      throw new Error('The pipeline should contains only Functions');
    }

    if (!pipeline.length) {
      throw new Error('You must specify at least one middleware on the Pipeline');
    }

    const params = getRequestParams(req, route);

    middlewares.push({
      pipeline,
      params,
      method,
      route,
    });
  };

  const processPipeline = (...middlewares) => {
    const [currentMiddleware, ...next] = middlewares;

    return currentMiddleware ? currentMiddleware(req, res, () => processPipeline(...next)) : res.end();
  };

  const process = () => {
    try {
      const { pipeline, params } = middlewares.find(processingMiddleware =>
        processingMiddleware.method === method && checkIsSameRoute(processingMiddleware.route, path));

      req.params = params;
      req.query = query;
      req.locals = {};

      processPipeline(...pipeline);
    } catch (err) {
      writeResponse(res, 404, {
        message: 'Route not found.'
      });

      res.end();
    }
  };

  const get = (route, ...pipeline) => addMiddlewares(HTTP_METHODS.GET, route, ...pipeline);

  const post = (route, ...pipeline) => addMiddlewares(HTTP_METHODS.POST, route, ...pipeline);

  const put = (route, ...pipeline) => addMiddlewares(HTTP_METHODS.PUT, route, ...pipeline);

  const remove = (route, ...pipeline) => addMiddlewares(HTTP_METHODS.DELETE, route, ...pipeline);

  return {
    delete: remove,
    process,
    post,
    put,
    get,
  };
};

module.exports = router;
