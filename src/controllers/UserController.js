const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const id = await User.create(req.payload);

    res.send().status(200).data({ id });
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
