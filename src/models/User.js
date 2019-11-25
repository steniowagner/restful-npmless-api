const { Model, dataTypes } = require('../../server/model');
const { NUMBER, STRING } = dataTypes;

const UserSchema = {
  collection: 'users',
  schema: {
    name: {
      type: STRING,
      required: true,
    },
    age: {
      type: NUMBER
    },
    email: {
      type: STRING,
      required: true,
    }
  }
};

module.exports = Model(UserSchema);
