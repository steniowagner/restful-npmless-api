const url = require('url');

const parseQueryParams = query => {
  if (!query) {
    return '';
  }

  const queryParams = query.split('&').reduce((accumulator, current) => {
    const [key, value] = current.split('=');

    return ({
      ...accumulator,
      [key]: value,
    });
  }, {});

  return queryParams;
};

const getRequestData = request => {
  const { method, url: urlPath } = request;
  const { pathname, query } = url.parse(urlPath);

  const path = pathname.replace(/^\/+|\/+$/g, '');

  return ({
    query: parseQueryParams(query) || '',
    method: method.toUpperCase(),
    path: path || '/',
  });
};

module.exports = getRequestData;
