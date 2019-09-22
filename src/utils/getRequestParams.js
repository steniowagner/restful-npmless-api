const parseRequest = require('./parseRequest');
const { VALUES } = require('./constants');

const getRequestParams = (req, route) => {
  const { path } = parseRequest(req);

  const pathResources = path.split('/').filter(pathResource => !!pathResource);
  const [_, ...routeResources] = route.split('/');

  const params = routeResources.reduce((accumulator, current, index) => {
    if (current.charAt(0) === VALUES.ROUTE_PARAM_FLAG) {
      const field = current.substring(1);

      return ({
        ...accumulator,
        [field]: pathResources[index],
      });
    }

    return accumulator;
  }, {});

  return params;
};

module.exports = getRequestParams;
