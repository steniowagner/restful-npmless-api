const encryptStringWithSHA256 = require('../utils/encryptStringWithSHA256');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const userPayload = {
      ...req.payload,
      passwordHash: encryptStringWithSHA256(req.payload.password),
      history: [],
    };

    delete userPayload.password;

    const id = await User.create(userPayload);

    return res.send().status(201).data({ id });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const queryParams = req.query;

    const users = await User.findAll(queryParams);

    return res.send().status(200).data({ users });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readOne = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne(id, {
      populate: 'history',
    });

    if (!user) {
      return res.send().status(404).data({
        error: 'User not found.',
      });
    }

    return res.send().status(200).data({ user });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { payload, params } = req;

    const user = await User.findOneAndUpdate(params.id, payload);

    if (!user) {
      return res.send().status(404).data({
        error: 'User not found.',
      });
    }

    return res.send().status(200).data({ user });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndRemove(id);

    if (!user) {
      return res.send().status(404).data({
        error: 'User not found.',
      });
    }

    return res.send().status(200).data({ user });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
