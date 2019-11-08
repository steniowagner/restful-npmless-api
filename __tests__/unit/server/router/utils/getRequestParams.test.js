const assert = require('assert');

const getRequestParams = require('../../../../../server/router/utils/getRequestParams');

let request = {};

const beforeEachTest = (method, url) => {
  request = {
    method,
    url,
  }
};

const getRequestParamsTest = () => {
  beforeEachTest('GET', '/users');
  assert.deepStrictEqual(getRequestParams(request, '/users'), {});

  beforeEachTest('GET', '/users/123');
  assert.deepStrictEqual(getRequestParams(request, '/users/#id'), {
    id: '123'
  });

  beforeEachTest('GET', '/users/123/docs/social-security');
  assert.deepStrictEqual(getRequestParams(request, '/users/#id/docs/#type'), {
    type: 'social-security',
    id: '123',
  });

  beforeEachTest('GET', '/users/123/docs/social-security?valid=true');
  assert.deepStrictEqual(getRequestParams(request, '/users/#id/docs/#type'), {
    type: 'social-security',
    id: '123',
  });
};

module.exports = getRequestParamsTest;
