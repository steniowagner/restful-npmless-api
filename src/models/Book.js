const { Model, dataTypes } = require('../../server/model');
const { VALUES } = require('../utils/constants');
const { STRING, ID } = dataTypes;

const BookSchema = {
  collection: 'books',
  schema: {
    title: {
      type: STRING,
      required: true,
    },
    isbn: {
      type: STRING,
      required: true,
      unique: true,
    },
    genre: {
      enum: VALUES.BOOK_GENRES,
      required: true,
    },
    author: {
      type: ID,
      required: true,
      collection: 'authors'
    },
  }
};

module.exports = Model(BookSchema);
