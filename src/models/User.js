const { Model, dataTypes } = require('../../server/model');
const { STRING } = dataTypes;

const UserSchema = {
  collection: 'users',
  schema: {
    username: {
      type: STRING,
      required: true,
    },
    name: {
      type: STRING,
      required: true,
    },
    email: {
      type: STRING,
      unique: true,
      required: true,
    },
  }
};

module.exports = Model(UserSchema);
