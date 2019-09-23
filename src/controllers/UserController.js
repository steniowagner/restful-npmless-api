const writeResponse = require('../utils/api/writeResponse');
const write = require('../utils/io/write');

exports.create = (req, res, next) => {
  console.log('UserController - CREATE');
  next();

  /* writeResponse(res, 404, {
    message: 'NOT FOUND FROM UserController - CREATE'
  }) */
};

exports.read = (req, res, next) => {
  write('123', 'users', {
    name: 'stenio'
  });

  write('456', 'users', {
    name: 'wagner'
  });

  write('456', 'items', {
    name: 'wagner'
  });

  writeResponse(res, 200, {
    message: 'READ SUCCESSFULLY FROM UserController - READ'
  })
  next();
};
