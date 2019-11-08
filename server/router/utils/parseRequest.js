const url = require('url');

const parseQueryParams = query => {
  if (!query) {
    return '';
  }

  const queryParams = query.split('&').reduce((accumulator, current) => {
    let [key, value] = current.split('=');

    if (accumulator[key]) {
      value = Array.isArray(accumulator[key])
        ? [...accumulator[key], value]
        : [accumulator[key], value];
    }

    return ({
      ...accumulator,
      [key]: value,
    });
  }, {});

  return queryParams;
};

const parseRequest = request => {
  const { method, url: urlPath } = request;
  const { pathname, query } = url.parse(urlPath);

  const path = pathname.replace(/^\/+|\/+$/g, '');

  return ({
    query: parseQueryParams(query) || '',
    method: method.toUpperCase(),
    path: path || '/',
  });
};

module.exports = parseRequest;
