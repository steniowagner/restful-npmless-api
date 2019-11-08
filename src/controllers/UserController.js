const writeResponse = require('../../server/router/utils/writeResponse');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const id = await User.create(req.payload);

    writeResponse(res, 201, {
      id,
    });
  } catch (err) {
    writeResponse(res, 500, {
      error: err.message
    });
  }
};

exports.readAll = async (req, res) => {
  const queryParams = req.query;

  const users = await User.findAll(queryParams);

  writeResponse(res, 200, {
    users,
  });
};
