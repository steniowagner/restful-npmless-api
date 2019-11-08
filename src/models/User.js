const { Model, dataTypes } = require('../../server/model');

const UserSchema = {
  collection: 'users',
  schema: {
    username: {
      type: dataTypes.STRING,
      required: true,
      unique: true,
    },
    name: {
      type: dataTypes.STRING,
      required: true,
    },
    email: {
      type: dataTypes.STRING,
      required: true,
      unique: true,
    },
  }
};

module.exports = Model(UserSchema);
