const parseRequestPayload = require('../utils/api/parseRequestPayload');
const writeResponse = require('../utils/api/writeResponse');
const { USER } = require('../models/types');
const Model = require('../models/Model');

const User = Model(USER);

exports.create = async (req, res) => {
  try {
    const payload = await parseRequestPayload(req);

    const id = await User.create(payload);

    writeResponse(res, 201, {
      id,
    });
  } catch (err) {
    writeResponse(res, 500, {
      message: 'READ SUCCESSFULLY FROM UserController - READ'
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
