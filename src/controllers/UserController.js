const encryptStringWithSHA256 = require('./utils/encryptStringWithSHA256');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const userPayload = {
      ...req.payload,
      password: encryptStringWithSHA256(req.payload.password),
    };

    const id = await User.create(userPayload);

    res.send().status(201).data({ id });
  } catch (err) {
    res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { payload, params } = req;

    const userUpdated = await User.findOneAndUpdate(params.id, payload);

    if (!userUpdated) {
      res.send().status(404).data({
        error: 'User not found.',
      });
    }

    res.send().status(404).data({
      error: 'User not found.',
    });
  } catch (err) {
    res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readAll = async (req, res) => {
  const queryParams = req.query;

  const users = await User.findAll(queryParams);

  res.send().status(200).data({ users });
};

exports.readOne = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne(id);

  res.send().status(200).data({ user });
};
