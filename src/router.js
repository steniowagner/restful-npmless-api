const getRequestParams = require('./utils/getRequestParams');
const getRequestData = require('./utils/getRequestData');
const { HTTP_METHODS } = require('./utils/constants');

const router = (req, res) => {
  // const { method, path } = getRequestData(req);
  const middlewares = [];

  const addMiddlewares = (method, route, ...pipeline) => {
    const isValidPipeline = pipeline.every(pipe => typeof pipe === 'function');

    if (!isValidPipeline) {
      throw new Error('The pipeline should contains only Functions');
    }

    if (!pipeline.length) {
      throw new Error('You must specify at least one middleware on the Pipeline');
    }

    middlewares.push({
      params: getRequestParams(req, route),
      pipeline,
      method,
      route,
    });
  };

  const processPipeline = (...middlewares) => {
    const [currentMiddleware, ...next] = middlewares;

    return currentMiddleware ? currentMiddleware(req, res, () => processPipeline(...next)) : res.end();
  }

  const process = () => {
    /* const { pipeline } = middlewares.find(processingMiddleware =>
      processingMiddleware.method === method && processingMiddleware.route === path);

    processPipeline(...pipeline); */
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
