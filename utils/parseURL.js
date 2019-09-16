const url = require('url');

const parseURL = rawURL => {
  const { pathname } = url.parse(rawURL, true);
  const trimmedURLPath = pathname.replace(/^\/+|\/+$/g, '');

  return trimmedURLPath;
};

module.exports = parseURL;
