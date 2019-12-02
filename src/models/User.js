const { Model, dataTypes } = require('../../server/model');
const { VALUES } = require('../utils/constants');

const { STRING, ID } = dataTypes;

const UserSchema = {
  collection: 'users',
  schema: {
    name: {
      type: STRING,
      required: true,
    },
    username: {
      type: STRING,
      required: true,
      unique: true,
    },
    email: {
      type: STRING,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: STRING,
      required: true,
    },
    role: {
      enum: [VALUES.ADMIN_ROLE, VALUES.COMMON_USER_ROLE],
      required: true,
    },
    history: [{
      book: {
        type: ID,
        required: true,
        collection: 'books'
      },
      loanDate: {
        type: STRING,
        required: true,
      },
      deliveryDate: {
        type: STRING,
        required: false,
      },
    }],
  }
};

module.exports = Model(UserSchema);
