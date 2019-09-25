const writeResponse = require('../utils/api/writeResponse');
const read = require('../utils/io/read');
const write = require('../utils/io/write');
exports.create = (req, res, next) => {
  console.log('UserController - CREATE');
  next();

  /* writeResponse(res, 404, {
    message: 'NOT FOUND FROM UserController - CREATE'
  }) */
};

exports.read = async (req, res, next) => {
  await write('123', 'users', {
    name: 'stenio'
  });

  await write('456', 'users', {
    name: 'wagner'
  });

  /* await write('456', 'items', {
    name: 'wagner'
  }); */

  const result = await read.all('items');
  console.log(result);
  writeResponse(res, 200, {
    message: 'READ SUCCESSFULLY FROM UserController - READ'
  })

  next();
};
