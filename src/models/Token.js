const { Model, dataTypes } = require('../../server/model');
const { NUMBER, STRING, ID } = dataTypes;

const TokenSchema = {
  collection: 'tokens',
  schema: {
    userId: {
      type: ID,
      required: false,
      collection: 'users'
    },
    expires: {
      type: NUMBER,
      required: true,
    },
    token: {
      type: STRING,
      required: true,
    },
  },
};

module.exports = Model(TokenSchema);
