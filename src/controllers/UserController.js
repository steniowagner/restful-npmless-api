const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const id = await User.create(req.payload);

    res.send().status(200).content({ id });
  } catch (err) {
    res.send().status(500).content({
      error: err.message,
    });
  }
};

exports.readAll = async (req, res) => {
  const queryParams = req.query;

  const users = await User.findAll(queryParams);

  res.send().status(200).content({ users });
};
