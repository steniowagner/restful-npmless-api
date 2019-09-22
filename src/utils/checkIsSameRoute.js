const { VALUES } = require('./constants');

const checkIsSameRoute = (endpoint, URLPath) => {
  const [_, ...endpointResources] = endpoint.split('/');
  const URLPathResources = URLPath.split('/');

  if (endpointResources.length !== URLPathResources.length) {
    return false;
  }

  for (let i = 0; i < endpointResources.length; i++) {
    if (endpointResources[i].charAt(0) === VALUES.ROUTE_PARAM_FLAG) {
      continue;
    }

    if (endpointResources[i] !== URLPathResources[i]) {
      return false;
    }
  }

  return true;
};

module.exports = checkIsSameRoute;
