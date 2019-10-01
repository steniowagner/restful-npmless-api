const { STRING } = require('./dataTypes');

const UserSchema = {
  username: {
    required: true,
    type: STRING,
    unique: true,
  },
  name: {
    required: true,
    type: STRING,
  },
  email: {
    type: STRING,
    unique: true,
  },
};

module.exports = UserSchema;
