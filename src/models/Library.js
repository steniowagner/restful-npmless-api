const { Model, dataTypes } = require('../../server/model');
const { STRING, NUMBER, ID } = dataTypes;

const LibrarySchema = {
  collection: 'library',
  schema: {
    waitingQueue: [{
      book: {
        type: ID,
        required: true,
        collection: 'books',
      },
      queue: [{
        type: ID,
        required: true,
        collection: 'users',
      }],
    }],
    bookCollection: [{
      book: {
        type: ID,
        required: true,
        collection: 'books',
      },
      totalQuantity: {
        type: NUMBER,
        required: true,
      },
      availableQuantity: {
        type: NUMBER,
        required: true,
      },
    }],
    borrowedBooks: [{
      book: {
        type: ID,
        required: true,
        collection: 'books',
      },
      user: {
        type: ID,
        required: true,
        collection: 'users',
      },
      borrowDate: {
        type: STRING,
        required: true,
      },
      deliveryDate: {
        type: STRING,
        required: true,
      }
    }],
  },
};

module.exports = Model(LibrarySchema);
