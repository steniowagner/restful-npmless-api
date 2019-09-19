const url = require('url');

const getRequestData = request => {
  const { method, url: urlPath } = request;

  const { pathname, query } = url.parse(urlPath, true);

  const path = pathname.replace(/^\/+|\/+$/g, '');

  return ({
    method: method.toUpperCase(),
    path: path || '/',
    query,
  });
};

module.exports = getRequestData;
