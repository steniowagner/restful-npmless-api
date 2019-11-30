const { Model, dataTypes } = require('../../server/model');
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
    },
    email: {
      type: STRING,
      required: true,
    },
    password: {
      type: STRING,
      required: true,
    },
  }
};

module.exports = Model(UserSchema);
