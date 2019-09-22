const assert = require('assert');

const parseRequest = require('../../../src/utils/parseRequest');
const { HTTP_METHODS } = require('../../../src/utils/constants');

let request = {};

const beforeEachTest = (method, url) => {
  request = {
    method,
    url,
  }
};

const parseRequestTest = () => {
  beforeEachTest('GET', '/users');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users',
    query: '',
  });

  beforeEachTest('GET', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.GET,
    path: 'users/2',
    query: '',
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
    query: '',
  });

  beforeEachTest('POST', '/users/2/orders');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.POST,
    path: 'users/2/orders',
    query: '',
  });

  beforeEachTest('PUT', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.PUT,
    path: 'users/2',
    query: '',
  });

  beforeEachTest('PUT', '/users/2/orders');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.PUT,
    path: 'users/2/orders',
    query: '',
  });

  beforeEachTest('DELETE', '/users/2');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.DELETE,
    path: 'users/2',
    query: '',
  });

  beforeEachTest('DELETE', '/users');
  assert.deepStrictEqual(parseRequest(request), {
    method: HTTP_METHODS.DELETE,
    path: 'users',
    query: '',
  });
};

module.exports = parseRequestTest;
