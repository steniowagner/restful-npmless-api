const Book = require('../models/Book');

exports.create = async (req, res, next) => {
  try {
    const { payload } = req;

    const bookId = await Book.create({
      author: payload.author,
      genre: payload.genre,
      title: payload.title,
      isbn: payload.isbn,
    });

    req.locals = {
      ...req.locals,
      bookId,
    };

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readAll = async (req, res) => {
  try {
    const books = await Book.findAll(req.query, {
      populate: 'author',
    });

    return res.send().status(200).data({ books });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readOne = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findOne(id, {
      populate: 'author',
    });

    if (!book) {
      return res.send().status(404).data({
        error: 'User not found',
      });
    }

    return res.send().status(200).data({ book });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { payload, params } = req;

    const book = await Book.findOneAndUpdate(params.id, payload);

    if (!book) {
      return res.send().status(404).data({
        error: 'Book not found',
      });
    }

    return res.send().status(200).data({ book });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findOneAndRemove(id);

    if (!book) {
      return res.send().status(404).data({
        error: 'Book not found',
      });
    }

    req.locals = {
      ...req.locals,
      authorId: book.author,
    };

    next();
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};
