const { Model, dataTypes } = require('../../server/model');
const { VALUES } = require('../utils/constants');
const { STRING, ID } = dataTypes;

const AuthorSchema = {
  collection: 'authors',
  schema: {
    name: {
      type: STRING,
      required: true,
    },
    genres: [{
      enum: VALUES.BOOK_GENRES,
      required: true,
    }],
    books: [{
      type: ID,
      required: false,
      collection: 'books',
    }],
  }
};

module.exports = Model(AuthorSchema);
