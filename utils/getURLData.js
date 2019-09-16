const url = require('url');

const getURLData = request => {
  const { method, url: urlPath } = request;

  const { pathname, query } = url.parse(urlPath, true);

  const path = pathname.replace(/^\/+|\/+$/g, '');

  return ({
    method: method.toUpperCase(),
    query,
    path,
  });
};

module.exports = getURLData;
