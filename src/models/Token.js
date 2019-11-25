const { Model, dataTypes } = require('../../server/model');
const { NUMBER, STRING } = dataTypes;

const TokenSchema = {
  collection: 'tokens',
  schema: {
    userId: {
      type: STRING,
      required: true,
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
