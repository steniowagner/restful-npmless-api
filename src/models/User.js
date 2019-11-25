const { Model, dataTypes } = require('../../server/model');
const { STRING } = dataTypes;

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
    password: {
      type: STRING,
      required: true,
    },
  }
};

module.exports = Model(UserSchema);
