const Book = require('../models/Book');

exports.create = async (req, res) => {
  try {
    const { payload } = req;

    const id = await Book.create(payload);

    return res.send().status(201).data({ id });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const books = await Book.findAll({
      ...req.query,
    }, {
      populate: 'author',
    });

    return res.send().status(200).data({ books });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
}
