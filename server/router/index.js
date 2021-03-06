const { EXCEPTION_MESSAGES, HTTP_METHODS } = require('./constants');
const parseRequestPayload = require('./utils/parseRequestPayload');
const getRequestParams = require('./utils/getRequestParams');
const checkIsSameRoute = require('./utils/checkIsSameRoute');
const parseRequest = require('./utils/parseRequest');

const router = (req, res) => {
  const { method, path, query } = parseRequest(req);
  const middlewares = [];

  res.send = () => ({
    status: statusCode => ({
        data: bodyResponse => {
          let responseContent = bodyResponse;

          if (responseContent && typeof responseContent !== 'object') {
            responseContent = {
              data: responseContent,
            }
          }

          res.writeHead(statusCode || 200);

          if (responseContent) {
            res.write(JSON.stringify(responseContent));
          }

          res.end();
        }
    }),
  });

  const addMiddlewares = (method, route, ...pipeline) => {
    const isValidPipeline = pipeline.every(pipe => typeof pipe === 'function');

    if (!isValidPipeline) {
      throw new Error(EXCEPTION_MESSAGES.INVALID_PIPELINE);
    }

    if (!pipeline.length) {
      throw new Error(EXCEPTION_MESSAGES.EMPTY_PIPELINE);
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

    return currentMiddleware ? currentMiddleware(req, res,
      () => processPipeline(...next)) : res.end();
  };

  const process = async () => {
    try {
      const { pipeline, params } = middlewares.find(processingMiddleware =>
        processingMiddleware.method === method
          && checkIsSameRoute(processingMiddleware.route, path));

      req.payload = await parseRequestPayload(req);
      req.params = params;
      req.query = query;
      req.locals = {};

      processPipeline(...pipeline);
    } catch (err) {
      res.send().status(404).data({
        message: EXCEPTION_MESSAGES.ROUTE_NOT_FOUND,
      });
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
