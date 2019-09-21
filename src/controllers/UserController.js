const writeResponse = require('../utils/writeResponse');

exports.create = (req, res, next) => {
  console.log(req.params)
  console.log('UserController - CREATE');
  /* writeResponse(res, 404, {
    message: 'NOT FOUND FROM UserController - CREATE'
  }) */
};

exports.read = (req, res, next) => {
  console.log(req.params)
  console.log('UserController - READ');
  writeResponse(res, 200, {
    message: 'READ SUCCESSFULLY FROM UserController - READ'
  })
};
