const assert = require('assert');

const parseRequest = require('../../../../../server/router/utils/parseRequest');
const { HTTP_METHODS } = require('../../../../../server/router/constants');

let request = {};

const beforeEachTest = (method, url) => {
  request = {
    method,
    url,
  }
};

const parseRequestTest = () => {
  beforeEachTest('GET', '/users', query = '');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users',
    query,
  });

  beforeEachTest('GET', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users/2',
    query,
  });

  beforeEachTest('GET', '/users/2?name=stenio&age=25');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users/2',
    query: {
      name: 'stenio',
      age: '25'
    },
  });

  beforeEachTest('POST', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.POST,
    path: 'users/2',
    query,
  });

  beforeEachTest('POST', '/users/2/orders');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.POST,
    path: 'users/2/orders',
    query,
  });

  beforeEachTest('PUT', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.PUT,
    path: 'users/2',
    query,
  });

  beforeEachTest('PUT', '/users/2/orders');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.PUT,
    path: 'users/2/orders',
    query,
  });

  beforeEachTest('DELETE', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.DELETE,
    path: 'users/2',
    query,
  });

  beforeEachTest('DELETE', '/users');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.DELETE,
    path: 'users',
    query,
  });

  beforeEachTest('GET', '/users?field=value1&field=value2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users',
    query: {
      field: ['value1', 'value2']
    },
  });

  beforeEachTest('GET', '/users?field=value1&field=value2&field=value3');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users',
    query: {
      field: ['value1', 'value2', 'value3']
    },
  });

  beforeEachTest('GET', '/users?other=field&field=value1&another=field&field=value2&field=value3');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users',
    query: {
      field: ['value1', 'value2', 'value3'],
      another: 'field',
      other: 'field',
    },
  });
};

module.exports = parseRequestTest;
