const Author = require('../models/Author');

exports.create = async (req, res) => {
  try {
    const { payload } = req;

    const id = await Author.create(payload);

    return res.send().status(201).data({ id });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
