const Author = require('../models/Author');

exports.create = async (req, res) => {
  try {
    const { payload } = req;

    const id = await Author.create({
      ...payload,
      books: [],
    });

    return res.send().status(201).data({ id });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readAll = async (_, res) => {
  try {
    const authors = await Author.findAll({}, {
      populate: 'books',
    });

    return res.send().status(200).data({ authors });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.readOne = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findOne(id, {
      populate: 'books',
    });

    if (!author) {
      return res.send().status(404).data({
        error: 'Author not found.',
      });
    }

    return res.send().status(200).data({ author });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findOneAndUpdate(id, req.payload);

    if (!author) {
      return res.send().status(404).data({
        error: 'Author not found.',
      });
    }

    return res.send().status(200).data({ author });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findOneAndRemove(id);

    if (!author) {
      return res.send().status(404).data({
        error: 'Author not found.',
      });
    }

    return res.send().status(200).data({ author });
  } catch (err) {
    return res.send().status(500).data({
      error: err.message,
    });
  }
}
